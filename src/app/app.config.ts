import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import {provideRouter, Router} from '@angular/router';

import {routes} from './app.route';
import {provideAnimations} from '@angular/platform-browser/animations';
import {MatNativeDateModule} from '@angular/material/core';
import {ACCESS_TOKEN} from './domain/constant';
import {JwtInterceptor} from "./services/jwt-interceptor";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {JwtModule} from '@auth0/angular-jwt';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {MatIconRegistry} from '@angular/material/icon';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(MatNativeDateModule, JwtModule.forRoot({
      config: {
        tokenGetter() {
          return localStorage.getItem(ACCESS_TOKEN)
        },
        // allowedDomains: ["localhost", "avs.sectigolabs.com", "avs.sectigo.com"],
        // disallowedRoutes: ["http://example.com/examplebadroute/"],
      }
    })),
    provideAnimations(), provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    provideAppInitializer(() => {
      const initializerFn = ((iconRegistry: MatIconRegistry) => () => {
        const defaultFontSetClasses = iconRegistry.getDefaultFontSetClass();
        const outlinedFontSetClasses = defaultFontSetClasses
          .filter((fontSetClass) => fontSetClass !== 'material-icons')
          .concat(['material-symbols-outlined']);
        iconRegistry.setDefaultFontSetClass(...outlinedFontSetClasses);
      })(inject(MatIconRegistry));
      return initializerFn();
    }),
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    provideZoneChangeDetection({eventCoalescing: true}),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {verticalPosition: 'top', horizontalPosition: 'center', duration: 5000}
    }
  ]
};
