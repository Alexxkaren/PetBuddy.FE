declare namespace Cypress {
  interface Chainable<Subject> {
    visitHomePage(): Chainable<Element>;
  }
}

Cypress.Commands.add('visitHomePage', () => {
  cy.visit('/');
});
