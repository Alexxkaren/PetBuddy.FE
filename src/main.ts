import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeSk from '@angular/common/locales/sk';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

registerLocaleData(localeSk, 'sk_SK');

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
