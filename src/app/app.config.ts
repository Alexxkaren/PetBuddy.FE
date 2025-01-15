import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  Injector,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpBackend,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { AuthModule } from '@auth0/auth0-angular';
import { provideServiceWorker } from '@angular/service-worker';
import { appInitializerFactory } from '../app/core/startup/appInitializer.factory';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { httpTranslateFactory } from './core/startup/httpTranslate.factory';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideHttpClient(withInterceptors([JwtInterceptor])),
    importProvidersFrom(
      BrowserModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpTranslateFactory,
          deps: [HttpBackend],
        },
      }),
      AuthModule.forRoot({
        domain: environment.auth.domain,
        clientId: environment.auth.clientId,
        authorizationParams: {
          redirect_uri: window.location.origin,
        },
      }),
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [Injector],
      multi: true,
    },
    provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
