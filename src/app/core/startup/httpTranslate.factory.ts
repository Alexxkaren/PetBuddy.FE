import { HttpBackend, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export const httpTranslateFactory = (
  httpBackend: HttpBackend,
): TranslateHttpLoader => {
  const httpClient = new HttpClient(httpBackend);
  return new TranslateHttpLoader(httpClient, '/i18n/', '.json');
};
