export class ProfilePage {
  editBasicInfoButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('edit-basic-info-btn');

  editContactInfoButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('edit-contact-info-btn');

  profileInfoTabButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('profile-info-btn');

  myPetsTabButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('mypets-btn');

  basicInfoDialogTitle = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('basic-info-dialog-title');

  contactInfoDialogTitle = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('contact-info-dialog-title');

  submitButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('submit-btn');

  cancelButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('cancel-btn');

  clickEditBasicInfo = (): Cypress.Chainable<any> =>
    this.editBasicInfoButton().click();

  clickEditContactInfo = (): Cypress.Chainable<any> =>
    this.editContactInfoButton().click();

  navigateToProfileInfoTab = (): Cypress.Chainable<any> =>
    this.profileInfoTabButton().click();

  navigateToMyPetsTab = (): Cypress.Chainable<any> =>
    this.myPetsTabButton().click();

  assertBasicInfoDialogIsDisplayed = (): Cypress.Chainable<any> =>
    this.basicInfoDialogTitle().should('be.visible');
  assertContactInfoDialogIsDisplayed = (): Cypress.Chainable<any> =>
    this.contactInfoDialogTitle().should('be.visible');
  closeDialogWithSubmit = (): Cypress.Chainable<any> =>
    this.submitButton().click();

  closeDialogWithCancel = (): Cypress.Chainable<any> =>
    this.cancelButton().click();
}
