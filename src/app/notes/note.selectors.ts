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
