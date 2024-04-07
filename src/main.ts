import 'hammerjs';
import {enableProdMode, importProvidersFrom} from '@angular/core';

import {environment} from './environments/environment';
import {AppComponent} from './app/app.component';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter} from '@angular/router';
import {APP_ROUTES} from './app/app.route';
import {provideHttpClient} from '@angular/common/http';
import {MatNativeDateModule} from '@angular/material/core';
import {provideAnimations} from '@angular/platform-browser/animations';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent,
  {
    providers: [
      provideRouter(APP_ROUTES),
      importProvidersFrom(MatNativeDateModule),
      provideAnimations(),
      provideHttpClient()
    ]
  })
  .catch(err => console.error(err));

