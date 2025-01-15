declare namespace Cypress {
    interface Chainable<Subject> {
      changeLanguage: (language: string) => Chainable<Subject>;
    }
  }
  
  Cypress.Commands.add('changeLanguage', (language: string) => {
    cy.visit(`/register?lang=${language}`);
  });