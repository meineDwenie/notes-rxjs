import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/all',
    pathMatch: 'full',
  },
  {
    path: 'all',
    loadComponent: () =>
      import('./components/views/all-view/all-view').then((c) => c.AllView),
    data: { title: 'All Items' },
  },
  {
    path: 'notes',
    loadComponent: () =>
      import('./components/views/notes-view/notes-view').then(
        (c) => c.NotesView
      ),
    data: { title: 'Notes' },
  },
  {
    path: 'notebooks',
    loadComponent: () =>
      import('./components/views/notebooks-view/notebooks-view').then(
        (c) => c.NotebooksView
      ),
    data: { title: 'Notebooks' },
  },
  {
    path: 'notebooks/:id',
    loadComponent: () =>
      import('./components/views/notebook-detail/notebook-detail').then(
        (c) => c.NotebookDetail
      ),
    data: { title: 'Notebook Details' },
  },
  {
    path: 'archive',
    loadComponent: () =>
      import('./components/views/archive-view/archive-view').then(
        (c) => c.ArchiveView
      ),
    data: { title: 'Archive' },
  },
  {
    path: 'trash',
    loadComponent: () =>
      import('./components/views/trash-view/trash-view').then(
        (c) => c.TrashView
      ),
    data: { title: 'Trash' },
  },
  {
    path: '**',
    redirectTo: '/all',
  },
];
