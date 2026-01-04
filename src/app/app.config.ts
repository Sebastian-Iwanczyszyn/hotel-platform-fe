import {APP_INITIALIZER, ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {keycloak} from './keycloak';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './interceptor/auth-interceptor';
import {registerLocaleData} from '@angular/common';
import localePl from '@angular/common/locales/pl';
import {DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import {PlDateAdapter} from './service/p1-date-adapter';

function initKeycloak() {
  return () =>
    keycloak.init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    });
}

registerLocaleData(localePl);

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: APP_INITIALIZER, useFactory: initKeycloak, multi: true},
    {provide: LOCALE_ID, useValue: 'pl-PL'},
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideNativeDateAdapter(),
    {provide: MAT_DATE_LOCALE, useValue: 'pl-PL'},
    {provide: DateAdapter, useClass: PlDateAdapter, deps: [MAT_DATE_LOCALE]},
  ]
};
