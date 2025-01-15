const desktopWidth = 1920;
const desktopHeight = 1080;

declare namespace Cypress {
  interface Chainable<Subject> {
    scaleForDesktop(): Chainable<Subject>;
  }
}

Cypress.Commands.add('scaleForDesktop', () => {
  cy.viewport(desktopWidth, desktopHeight);
});
