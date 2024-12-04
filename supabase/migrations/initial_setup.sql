-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type user_role as enum ('admin', 'teacher', 'user');

-- Create tables
create table if not exists public.profiles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    role user_role default 'user' not null,
    full_name text,
    avatar_url text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    unique(user_id)
);

create table if not exists public.thesis (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    author text,
    field text,
    supervisor text,
    university text,
    abstract text,
    keywords text[],
    user_id uuid references auth.users(id) on delete cascade not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create table if not exists public.chapters (
    id uuid primary key default uuid_generate_v4(),
    thesis_id uuid references public.thesis(id) on delete cascade not null,
    title text not null,
    order_number integer not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create table if not exists public.sections (
    id uuid primary key default uuid_generate_v4(),
    chapter_id uuid references public.chapters(id) on delete cascade not null,
    title text not null,
    content text not null default '',
    order_number integer not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create table if not exists public.thesis_references (
    id uuid primary key default uuid_generate_v4(),
    thesis_id uuid references public.thesis(id) on delete cascade not null,
    citation_type text not null,
    authors text[] not null,
    title text not null,
    year integer,
    publisher text,
    url text,
    doi text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create table if not exists public.custom_commands (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    description text not null,
    handler text not null,
    created_by uuid references auth.users(id) on delete cascade not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Create indexes
create index if not exists idx_thesis_user_id on public.thesis(user_id);
create index if not exists idx_chapters_thesis_id on public.chapters(thesis_id);
create index if not exists idx_sections_chapter_id on public.sections(chapter_id);
create index if not exists idx_references_thesis_id on public.thesis_references(thesis_id);

-- Create updated_at triggers
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
    before update on public.profiles
    for each row
    execute function update_updated_at_column();

create trigger update_thesis_updated_at
    before update on public.thesis
    for each row
    execute function update_updated_at_column();

create trigger update_chapters_updated_at
    before update on public.chapters
    for each row
    execute function update_updated_at_column();

create trigger update_sections_updated_at
    before update on public.sections
    for each row
    execute function update_updated_at_column();

create trigger update_thesis_references_updated_at
    before update on public.thesis_references
    for each row
    execute function update_updated_at_column();

create trigger update_custom_commands_updated_at
    before update on public.custom_commands
    for each row
    execute function update_updated_at_column();

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.thesis enable row level security;
alter table public.chapters enable row level security;
alter table public.sections enable row level security;
alter table public.thesis_references enable row level security;
alter table public.custom_commands enable row level security;

-- Create policies
-- Profiles policies
create policy "Users can view their own profile"
    on public.profiles for select
    using (auth.uid() = user_id);

create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = user_id);

-- Thesis policies
create policy "Users can view their own thesis"
    on public.thesis for select
    using (auth.uid() = user_id);

create policy "Teachers can view their students' thesis"
    on public.thesis for select
    using (
        exists (
            select 1 from public.profiles
            where user_id = auth.uid()
            and role = 'teacher'
        )
    );

create policy "Users can create their own thesis"
    on public.thesis for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own thesis"
    on public.thesis for update
    using (auth.uid() = user_id);

create policy "Users can delete their own thesis"
    on public.thesis for delete
    using (auth.uid() = user_id);

-- Chapters policies
create policy "Users can view chapters of accessible thesis"
    on public.chapters for select
    using (
        exists (
            select 1 from public.thesis
            where thesis.id = chapters.thesis_id
            and (
                thesis.user_id = auth.uid()
                or exists (
                    select 1 from public.profiles
                    where user_id = auth.uid()
                    and role = 'teacher'
                )
            )
        )
    );

create policy "Users can create chapters in their thesis"
    on public.chapters for insert
    with check (
        exists (
            select 1 from public.thesis
            where thesis.id = chapters.thesis_id
            and thesis.user_id = auth.uid()
        )
    );

create policy "Users can update chapters in their thesis"
    on public.chapters for update
    using (
        exists (
            select 1 from public.thesis
            where thesis.id = chapters.thesis_id
            and thesis.user_id = auth.uid()
        )
    );

create policy "Users can delete chapters in their thesis"
    on public.chapters for delete
    using (
        exists (
            select 1 from public.thesis
            where thesis.id = chapters.thesis_id
            and thesis.user_id = auth.uid()
        )
    );

-- Sections policies (similar to chapters)
create policy "Users can view sections of accessible chapters"
    on public.sections for select
    using (
        exists (
            select 1 from public.chapters
            join public.thesis on thesis.id = chapters.thesis_id
            where chapters.id = sections.chapter_id
            and (
                thesis.user_id = auth.uid()
                or exists (
                    select 1 from public.profiles
                    where user_id = auth.uid()
                    and role = 'teacher'
                )
            )
        )
    );

create policy "Users can create sections in their chapters"
    on public.sections for insert
    with check (
        exists (
            select 1 from public.chapters
            join public.thesis on thesis.id = chapters.thesis_id
            where chapters.id = sections.chapter_id
            and thesis.user_id = auth.uid()
        )
    );

create policy "Users can update sections in their chapters"
    on public.sections for update
    using (
        exists (
            select 1 from public.chapters
            join public.thesis on thesis.id = chapters.thesis_id
            where chapters.id = sections.chapter_id
            and thesis.user_id = auth.uid()
        )
    );

create policy "Users can delete sections in their chapters"
    on public.sections for delete
    using (
        exists (
            select 1 from public.chapters
            join public.thesis on thesis.id = chapters.thesis_id
            where chapters.id = sections.chapter_id
            and thesis.user_id = auth.uid()
        )
    );

-- References policies (similar to chapters)
create policy "Users can view references of accessible thesis"
    on public.thesis_references for select
    using (
        exists (
            select 1 from public.thesis
            where thesis.id = thesis_references.thesis_id
            and (
                thesis.user_id = auth.uid()
                or exists (
                    select 1 from public.profiles
                    where user_id = auth.uid()
                    and role = 'teacher'
                )
            )
        )
    );

create policy "Users can create references in their thesis"
    on public.thesis_references for insert
    with check (
        exists (
            select 1 from public.thesis
            where thesis.id = thesis_references.thesis_id
            and thesis.user_id = auth.uid()
        )
    );

create policy "Users can update references in their thesis"
    on public.thesis_references for update
    using (
        exists (
            select 1 from public.thesis
            where thesis.id = thesis_references.thesis_id
            and thesis.user_id = auth.uid()
        )
    );

create policy "Users can delete references in their thesis"
    on public.thesis_references for delete
    using (
        exists (
            select 1 from public.thesis
            where thesis.id = thesis_references.thesis_id
            and thesis.user_id = auth.uid()
        )
    );

-- Custom commands policies
create policy "Anyone can view custom commands"
    on public.custom_commands for select
    using (true);

create policy "Only admins can manage custom commands"
    on public.custom_commands for all
    using (
        exists (
            select 1 from public.profiles
            where user_id = auth.uid()
            and role = 'admin'
        )
    );

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (user_id, role)
    values (new.id, 'user');
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation




-- Drop existing trigger if needed
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Then recreate the trigger
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();