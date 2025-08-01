import { createAction, props } from '@ngrx/store';
import { Notebook } from './notebook.model';

// adding notebook
export const addNotebook = createAction(
  '[Notebooks] Add Notebook',
  props<{ notebook: Notebook }>()
);

// editing notebook
export const updateNotebook = createAction(
  '[Notebooks] Update Notebook',
  props<{ update: { id: string; changes: Partial<Notebook> } }>()
);

// deleting notebook
export const deleteNotebook = createAction(
  '[Notebooks] Delete Notebook',
  props<{ id: string }>()
);

// loading notebooks
export const loadNotebooks = createAction('[Notebooks] Load Notebooks');

// loading notebooks success
export const loadNotebooksSuccess = createAction(
  '[Notebooks] Load Notebooks Success',
  props<{ notebooks: Notebook[] }>()
);