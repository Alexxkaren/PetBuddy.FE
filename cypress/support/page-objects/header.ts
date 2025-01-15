const translationKeys = {
  started: 'header.started',
};

export class Header {
  loginDesktopButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('header-started-btn');

  loginMobileButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('menu-started-btn');

  languageDesktopButton = (
    language: string,
  ): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId(`header-btn-lang-${language}`);

  languageMobileButton = (
    language: string,
  ): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId(`menu-btn-lang-${language}`);

  mobileMenuButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('header-mobile-menu-btn');

  profileDesktopButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('header-profile-btn');

  logoutDesktopButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('header-logout-btn');

  profileMobileButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('menu-profile-btn');

  logoutMobileButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('menu-logout-btn');

  setDesktopLanguage = (language: string): Cypress.Chainable<any> =>
    this.languageDesktopButton(language).click();

  setMobileLanguage = (language: string): Cypress.Chainable<any> =>
    this.openMenu().then(() => this.languageMobileButton(language).click());

  openMenu = (): Cypress.Chainable<any> => this.mobileMenuButton().click();

  assertDesktopLoginIsDisplayed = (): Cypress.Chainable<any> =>
    this.loginDesktopButton()
      .getByTestId('header-started-btn-text')
      .assertTranslationIsDisplayed(translationKeys.started);

  assertMobileLoginIsDisplayed = (): Cypress.Chainable<any> =>
    this.loginMobileButton()
      .getByTestId('menu-started-btn-text')
      .assertTranslationIsDisplayed(translationKeys.started);
}