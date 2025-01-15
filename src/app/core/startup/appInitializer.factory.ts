import { Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { supportedLanguages } from '../../models/infra/supported-languages.enum.js';

export const appInitializerFactory =
  (injector: Injector): (() => Promise<void>) =>
  async () => {
    const translate = injector.get(TranslateService);
    const browserLanguage = translate.getBrowserCultureLang() ?? '';
    const selectedLang = supportedLanguages.find((lang) =>
      lang.Code.startsWith(browserLanguage),
    );

    let selectedLanguage = supportedLanguages[0].Code;

    if (selectedLang) {
      selectedLanguage = selectedLang.Code;
    } else {
      selectedLanguage = supportedLanguages[0].Code;
    }

    translate.addLangs(supportedLanguages.map((lang) => lang.Code));
    translate.setDefaultLang(selectedLanguage);
    await lastValueFrom(translate.use(selectedLanguage)).catch(() => {});
  };
