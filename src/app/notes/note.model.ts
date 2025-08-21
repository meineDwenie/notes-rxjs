export interface Note {
  id: string; // unique id
  title: string;
  content: string;
  color?: string;
  createdAt?: number;
  images?: string[];
  pinned?: boolean;
}

export interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}
