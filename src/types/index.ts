export interface ThesisMetadata {
  id: string;
  title: string;
  author?: string;
  field?: string;
  supervisor?: string;
  university?: string;
  abstract?: string;
  keywords?: string[];
  date?: string;
}

export interface Section {
  id: string;
  title: string;
  content: string;
}

export interface Chapter {
  id: string;
  title: string;
  sections: Section[];
}

export interface Reference {
  id: string;
  text: string;
  type: 'book' | 'article' | 'website' | 'other';
  authors: string[];
  year?: number;
  url?: string;
  doi?: string;
}

export interface DocumentData {
  metadata: ThesisMetadata;
  chapters: Chapter[];
  references: Reference[];
}