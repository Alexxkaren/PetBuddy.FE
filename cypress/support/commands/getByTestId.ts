declare namespace Cypress {
  interface Chainable<Subject> {
    getByTestId: (input: string) => Chainable<JQuery<HTMLElement>>;
  }
}

Cypress.Commands.add('getByTestId', (input: string) => {
  return cy.get(`[data-cy=${input}]`);
});
