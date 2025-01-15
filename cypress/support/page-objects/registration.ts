export class Registration {
    firstNameInput = (): Cypress.Chainable<JQuery<HTMLElement>> =>
      cy.getByTestId('input-register-first-name');

    lastNameInput = (): Cypress.Chainable<JQuery<HTMLElement>> =>
      cy.getByTestId('input-register-last-name');

    emailInput = (): Cypress.Chainable<JQuery<HTMLElement>> =>
      cy.getByTestId('input-register-email');

    dobInput = (): Cypress.Chainable<JQuery<HTMLElement>> =>
      cy.getByTestId('input-register-dob');

    phoneInput = (): Cypress.Chainable<JQuery<HTMLElement>> =>
      cy.getByTestId('input-register-phone');

    stateSelect = (): Cypress.Chainable<JQuery<HTMLElement>> =>
      cy.getByTestId('select-register-state');

    citySelect = (): Cypress.Chainable<JQuery<HTMLElement>> =>
      cy.getByTestId('select-register-city');

    addressInput = (): Cypress.Chainable<JQuery<HTMLElement>> =>
      cy.getByTestId('input-register-adress');

    submitButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
      cy.getByTestId('btn-register-submit');

    fillForm(
      firstName: string,
      lastName: string,
      email: string,
      dob: string,
      phone: string,
      state: string,
      city: string,
      address: string
    ): void {
      this.firstNameInput().type(firstName);
      this.lastNameInput().type(lastName);
      this.emailInput().type(email);
      this.dobInput().type(dob, { force: true });
      this.phoneInput().type(phone, { force: true });

      this.stateSelect().click();
      cy.contains('mat-option', state).click();

      this.citySelect().click();
      cy.contains('mat-option', city).click();

      this.addressInput().type(address);
    }

    validateEmptyInputs(): void {
      this.firstNameInput().focus().blur();
      this.lastNameInput().focus().blur();
      this.emailInput().focus().blur();
      this.dobInput().focus().blur();
      this.phoneInput().focus().blur();
      this.stateSelect().focus().blur();
      this.citySelect().focus().blur();
      this.addressInput().focus().blur();

      cy.readValueFromFile('validations.field_required').then((errorMessage) => {
        cy.contains(errorMessage).should('be.visible');
      });
    }
  }
