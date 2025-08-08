import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { App } from './app/app';
import { appConfig } from './app/app.config';
import { routes } from './app/app.routes';
import { notesReducer } from './app/notes/note.reducer';
import { notebooksReducer } from './app/notebooks/notebook.reducer';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    provideRouter(routes),
    provideStore({
      notes: notesReducer,
      notebooks: notebooksReducer,
    }),
    ...(appConfig.providers ?? []),
    provideStoreDevtools(),
  ],
}).catch((err) => console.error(err));
