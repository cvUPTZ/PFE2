export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      thesis: {
        Row: {
          id: string
          title: string
          author: string | null
          field: string | null
          supervisor: string | null
          university: string | null
          abstract: string | null
          keywords: string[] | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author?: string | null
          field?: string | null
          supervisor?: string | null
          university?: string | null
          abstract?: string | null
          keywords?: string[] | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string | null
          field?: string | null
          supervisor?: string | null
          university?: string | null
          abstract?: string | null
          keywords?: string[] | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      chapters: {
        Row: {
          id: string
          thesis_id: string
          title: string
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          thesis_id: string
          title: string
          order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          thesis_id?: string
          title?: string
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      sections: {
        Row: {
          id: string
          chapter_id: string
          title: string
          content: string
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          chapter_id: string
          title: string
          content: string
          order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          chapter_id?: string
          title?: string
          content?: string
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      custom_commands: {
        Row: {
          id: string
          name: string
          description: string
          handler: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          handler: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          handler?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'teacher' | 'user'
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: 'admin' | 'teacher' | 'user'
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'teacher' | 'user'
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}