import { createReducer, on } from '@ngrx/store';
import { NotesState } from './note.model';
import * as NoteActions from '../notes/note.actions';

export const notesFeatureKey = 'notes';

export const initialState: NotesState = {
  notes: [],
  loading: false,
  searchTerm: '',
  error: null,
};

export const notesReducer = createReducer(
  initialState,
  on(NoteActions.addNote, (state, { note }) => ({
    ...state,
    notes: [...state.notes, note],
  })),

  on(NoteActions.updateNote, (state, { update }) => ({
    ...state,
    notes: state.notes.map((note) =>
      note.id == update.id ? { ...note, ...update.changes } : note
    ),
  })),

  on(NoteActions.deleteNote, (state, { id }) => ({
    ...state,
    notes: [...state.notes.filter((note) => note.id != id)],
  })),

  on(NoteActions.loadNotes, (state) => ({
    ...state,
    loading: true,
  })),

  on(NoteActions.loadNotesSuccess, (state, { notes }) => ({
    ...state,
    notes: notes,
    loading: false,
  })),

  on(NoteActions.togglePinNote, (state, { id }) => ({
    ...state,
    notes: state.notes.map((note) =>
      note.id === id ? { ...note, pinned: !note.pinned } : note
    ),
  })),

  on(NoteActions.setSearchTerm, (state, { term }) => ({
    ...state,
    searchTerm: term,
  })),

  // Archive reducers
  on(NoteActions.archiveNote, (state, { id }) => ({
    ...state,
    notes: state.notes.map((note) =>
      note.id === id
        ? { ...note, archived: true, archivedAt: Date.now() }
        : note
    ),
  })),

  on(NoteActions.unarchiveNote, (state, { id }) => ({
    ...state,
    notes: state.notes.map((note) =>
      note.id === id
        ? { ...note, archived: false, archivedAt: undefined }
        : note
    ),
  })),

  // Trash reducers
  on(NoteActions.trashNote, (state, { id }) => ({
    ...state,
    notes: state.notes.map((note) =>
      note.id === id ? { ...note, trashed: true, trashedAt: Date.now() } : note
    ),
  })),

  on(NoteActions.restoreNote, (state, { id }) => ({
    ...state,
    notes: state.notes.map((note) =>
      note.id === id ? { ...note, trashed: false, trashedAt: undefined } : note
    ),
  })),

  on(NoteActions.emptyTrash, (state) => ({
    ...state,
    notes: state.notes.filter((note) => !note.trashed),
  }))
);
