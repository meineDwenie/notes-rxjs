import { createReducer, on } from '@ngrx/store';
import { Notebook } from './notebook.model';
import * as NotebookActions from '../notebooks/notebook.actions';

export const notebooksFeatureKey = 'notebooks';

export interface NotebooksState {
  notebooks: Notebook[];
  loading: boolean;
  error: string | null;
}

export const initialState: NotebooksState = {
  notebooks: [],
  loading: false,
  error: null,
};

export const notebooksReducer = createReducer(
  initialState,
  on(NotebookActions.addNotebook, (state, { notebook }) => ({
    ...state,
    notebooks: [...state.notebooks, notebook],
  })),

  on(NotebookActions.updateNotebook, (state, { update }) => ({
    ...state,
    notebooks: state.notebooks.map((notebook) =>
      notebook.id == update.id ? { ...notebook, ...update.changes } : notebook
    ),
  })),

  on(NotebookActions.deleteNotebook, (state, { id }) => ({
    ...state,
    notebooks: [...state.notebooks.filter((notebook) => notebook.id != id)],
  })),

  on(NotebookActions.loadNotebooks, (state) => ({
    ...state,
    loading: true,
  })),

  on(NotebookActions.loadNotebooksSuccess, (state, { notebooks }) => ({
    ...state,
    notebooks: notebooks,
    loading: false,
  }))
);
