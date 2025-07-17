export interface Note {
  id: string; // unique id
  title: string;
  content: string;
  color?: string;
  createdAt?: number;
  images?: string[];
}
