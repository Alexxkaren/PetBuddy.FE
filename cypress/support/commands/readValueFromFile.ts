declare namespace Cypress {
  interface Chainable<Subject> {
    readValueFromFile(value: string): Chainable<string>;
  }
}

Cypress.Commands.add('readValueFromFile', (value: string) => {
  const path = `./public/i18n/${Cypress.env('currentLanguage')}.json`;
  cy.readFile(path).its(value);
});
