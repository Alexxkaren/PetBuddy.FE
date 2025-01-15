const mobileWidth = 500;
const mobileHeight = 800;

declare namespace Cypress {
  interface Chainable<Subject> {
    scaleForMobile(): Chainable<Subject>;
  }
}

Cypress.Commands.add('scaleForMobile', () => {
  cy.viewport(mobileWidth, mobileHeight);
});
