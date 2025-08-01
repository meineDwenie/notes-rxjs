import { Note } from '../notes/note.model';

export interface Notebook {
  id: string; // unique id
  name: string;
  notes: Note[];
  createdAt?: number;
}
