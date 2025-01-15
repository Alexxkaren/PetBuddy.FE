export class MainPage {
    addAnimalButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
      cy.getByTestId('add-animal-button');

    clickAddAnimalButton = (): Cypress.Chainable<any> =>
      this.addAnimalButton().click();

    assertAddAnimalButtonIsDisplayedForAuthenticatedUser = (): Cypress.Chainable<any> =>
      this.addAnimalButton().should('exist').and('be.visible');
  }
