import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import { provideStoreDevtools } from '@ngrx/store-devtools';

bootstrapApplication(App, {
  ...appConfig,
  providers: [...(appConfig.providers ?? []), provideStoreDevtools()],
}).catch((err) => console.error(err));
