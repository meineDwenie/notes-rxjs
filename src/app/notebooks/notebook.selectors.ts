import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromNotebooks from '../notebooks/notebook.reducer';

export const selectNotesState =
  createFeatureSelector<fromNotebooks.NotebooksState>(
    fromNotebooks.notebooksFeatureKey
  );

export const selectAllNotebooks = createSelector(
  selectNotesState,
  (state: fromNotebooks.NotebooksState) => state.notebooks // notebooks array
);

export const selectNotebooksLoading = createSelector(
  selectNotesState,
  (state: fromNotebooks.NotebooksState) => state.loading
);
