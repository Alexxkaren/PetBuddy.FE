declare namespace Cypress {
  interface Chainable {
    loginAuth0: () => Chainable<void>;
  }
}

Cypress.Commands.add('loginAuth0', () => {
  const validUser = Cypress.env('validUser');
  const authUrl = Cypress.env('authUrl');

  if (!validUser || !authUrl) {
    throw new Error(
      'Auth0 URL or valid user credentials are not defined in Cypress environment variables.',
    );
  }

  cy.origin(authUrl, { args: { validUser } }, ({ validUser }) => {
    cy.get('#username').type(validUser.username);
    cy.get('#password').type(validUser.password);
    cy.get('button[type="submit"][name="action"]').click();
  });
  
  cy.intercept('GET', '**/api/UserData/IsRegistered').as('userDataCheck');
  cy.wait('@userDataCheck').its('response.statusCode').should('eq', 200);
});
