export interface Note {
  id: string; // unique id
  title: string;
  content: string;
  color?: string;
  createdAt?: number;
  images?: string[];
  pinned?: boolean;
  archived?: boolean; // For archive view
  trashed?: boolean; // For trash view
  trashedAt?: number; // When it was moved to trash (useful for auto-cleanup)
  archivedAt?: number;
  checkboxes?: CheckboxItem[];
}

export interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

export interface CheckboxItem {
  id: string;
  text: string;
  checked: boolean;
  order: number; // For ordering checkboxes
}
