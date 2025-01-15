import { Language } from '../support/models/language.enum';
import { Header } from '../support/page-objects/header';

const languages: Language[] = [Language.english, Language.slovak];
const header = new Header();

languages.forEach((language) => {
  describe(`Header - ${language}`, () => {
    before(() => {
      Cypress.env('currentLanguage', language);
    });

    describe('Desktop', () => {
      before(() => {
        cy.scaleForDesktop();
        cy.visitHomePage();
        header.setDesktopLanguage(language);
      });

      it('should display correct translations', () => {
        header.assertDesktopLoginIsDisplayed();
      });
    });

    describe('Mobile', () => {
      before(() => {
        cy.scaleForMobile();
        cy.visitHomePage();
        header.setMobileLanguage(language);
      });

      it('should display correct translations', () => {
        header.openMenu();
        header.assertMobileLoginIsDisplayed();
      });
    });
  });
});
