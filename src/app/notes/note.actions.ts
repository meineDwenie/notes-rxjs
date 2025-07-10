import { createAction, props } from '@ngrx/store';
import { Note } from './note.model';

// adding note
export const addNote = createAction(
  '[Notes] Add Note',
  props<{ note: Note }>()
);

// editing note
export const updateNote = createAction(
  '[Notes] Update Note',
  props<{ update: { id: string; changes: Partial<Note> } }>()
);

// deleting note
export const deleteNote = createAction(
  '[Notes] Delete Note',
  props<{ id: string }>()
);

// loading note
export const loadNotes = createAction('[Notes] Load Note');

// loading note success
export const loadNotesSuccess = createAction(
  '[Notes] Load Note Success',
  props<{ notes: Note[]}>()
);
