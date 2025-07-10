import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';
import { ActionReducer, provideState, provideStore } from '@ngrx/store';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import * as fromNotes from './notes/note.reducer';

import { localStorageSync } from 'ngrx-store-localstorage';

const keyToSync = [fromNotes.notesFeatureKey];

function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return typeof window !== 'undefined'
    ? localStorageSync({
        keys: keyToSync,
        rehydrate: true,
        storage: window.localStorage,
        removeOnUndefined: true,
      })(reducer)
    : reducer;
}

const metaReducers = [localStorageSyncReducer];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideStore({}, { metaReducers }),
    provideState(fromNotes.notesFeatureKey, fromNotes.notesReducer),
    provideEffects([]),
    provideClientHydration(withEventReplay()),
  ],
};
