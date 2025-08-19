import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromNotes from '../notes/note.reducer';

export const selectNotesState = createFeatureSelector<fromNotes.NotesState>(
  fromNotes.notesFeatureKey
);

export const selectAllNotes = createSelector(
  selectNotesState,
  (state: fromNotes.NotesState) => state.notes // notes array
);

export const selectNotesLoading = createSelector(
  selectNotesState,
  (state: fromNotes.NotesState) => state.loading
);

export const selectSearchTerm = createSelector(
  selectNotesState,
  (state) => state.searchTerm
);

export const selectFilteredNotes = createSelector(
  selectAllNotes,
  selectSearchTerm,
  (notes, term) =>
    notes.filter(
      (n) =>
        n.title.toLowerCase().includes(term.toLowerCase()) ||
        n.content.toLowerCase().includes(term.toLowerCase())
    )
);
