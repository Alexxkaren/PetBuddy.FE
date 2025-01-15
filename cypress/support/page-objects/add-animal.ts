export class AddAnimal {
  // Step 1: Pet Type Selection
  getPetTypeButton = (petTypeId: string): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId(`pet-type-button-${petTypeId}`);

  clickPetTypeButton = (petTypeId: string): Cypress.Chainable<any> =>
    this.getPetTypeButton(petTypeId).click();

  assertPetTypeSelected = (petTypeId: string): Cypress.Chainable<any> =>
    this.getPetTypeButton(petTypeId).should('have.class', 'selected');

  getStep1NextButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('step-1-next-button');

  assertStep1NextButtonEnabled = (): Cypress.Chainable<any> =>
    this.getStep1NextButton().should('not.be.disabled');

  // Step 2: Placement and Address
  getPlacementButton = (placementId: string): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId(`placement-button-${placementId}`);

  clickPlacementButton = (placementId: string): Cypress.Chainable<any> =>
    this.getPlacementButton(placementId).click();

  assertPlacementSelected = (placementId: string): Cypress.Chainable<any> =>
    this.getPlacementButton(placementId).should('have.class', 'selected');

  getCountrySelect = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('country-select');

  selectCountryOption = (countryId: string): Cypress.Chainable<any> =>
    cy.getByTestId(`country-option-${countryId}`).click();

  getCitySelect = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('city-select');

  selectCityOption = (cityId: string): Cypress.Chainable<any> =>
    cy.getByTestId(`city-option-${cityId}`).click();

  getAddressInput = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('address-field');

  typeAddress = (address: string): Cypress.Chainable<any> =>
    this.getAddressInput().type(address);

  getStep2NextButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('step-2-next-button');

  assertStep2NextButtonEnabled = (): Cypress.Chainable<any> =>
    this.getStep2NextButton().should('not.be.disabled');

  assertStep2NextButtonDisabled = (): Cypress.Chainable<any> =>
    this.getStep2NextButton().should('be.disabled');

  // Step 3: Gender Type
  getGenderTypeButton = (genderTypeId: number): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId(`gender-type-${genderTypeId}`);

  clickGenderTypeButton = (genderTypeId: number): Cypress.Chainable<any> =>
    this.getGenderTypeButton(genderTypeId).click();

  assertGenderTypeSelected = (genderTypeId: number): Cypress.Chainable<any> =>
    this.getGenderTypeButton(genderTypeId).should('have.class', 'selected');

  assertGenderTypeNotSelected = (genderTypeId: number): Cypress.Chainable<any> =>
    this.getGenderTypeButton(genderTypeId).should('not.have.class', 'selected');

  getStep3NextButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('step-3-next-button');

  clickStep3NextButton = (): Cypress.Chainable<any> =>
    this.getStep3NextButton().click();

  assertStep3NextButtonDisabled = (): Cypress.Chainable<any> =>
    this.getStep3NextButton().should('be.disabled');

  // Step 4: Personality Selection
  getPersonalityButton = (natureId: number): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId(`personality-button-${natureId}`);

  clickPersonalityButton = (natureId: number): Cypress.Chainable<any> =>
    this.getPersonalityButton(natureId).click();

  assertPersonalityButtonSelected = (natureId: number): Cypress.Chainable<any> =>
    this.getPersonalityButton(natureId).should('have.class', 'selected');

  assertPersonalityButtonNotSelected = (natureId: number): Cypress.Chainable<any> =>
    this.getPersonalityButton(natureId).should('not.have.class', 'selected');

  getStep4NextButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.getByTestId('step-4-next-button');

  clickStep4NextButton = (): Cypress.Chainable<any> =>
    this.getStep4NextButton().click();

  assertStep4NextButtonDisabled = (): Cypress.Chainable<any> =>
    this.getStep4NextButton().should('be.disabled');

  assertStep4NextButtonEnabled = (): Cypress.Chainable<any> =>
    this.getStep4NextButton().should('not.be.disabled');

  // Step 5: Additional Information
getPetNameInput = (): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.getByTestId('pet-name-input');

getPetAgeInput = (): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.getByTestId('pet-age-input');

getPetBreedSelect = (): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.getByTestId('pet-breed-select');

getPetSizeSelect = (): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.getByTestId('pet-size-select');

getPetDescriptionInput = (): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.getByTestId('pet-description-input');

getVaccinatedCheckbox = (): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.getByTestId('vaccinated-checkbox');

getMedicalPapersCheckbox = (): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.getByTestId('medical-papers-checkbox');

getImageUploadInput = (): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.getByTestId('pet-image-input');

getSubmitAnimalButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.getByTestId('submit-animal-button');

getImageUpload = (): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.getByTestId('pet-image-input');

enterPetName = (name: string): Cypress.Chainable<any> =>
  this.getPetNameInput().type(name, { force: true });

enterPetAge = (age: string): Cypress.Chainable<any> =>
  this.getPetAgeInput().type(age, { force: true });

selectPetBreed = (breedId: string): Cypress.Chainable<any> =>
  this.getPetBreedSelect().click({ force: true })
    .getByTestId(`pet-breed-option-${breedId}`).click({ force: true });

selectPetSize = (sizeId: string): Cypress.Chainable<any> =>
  this.getPetSizeSelect().click({ force: true })
    .getByTestId(`pet-size-option-${sizeId}`).click({ force: true });

enterDescription = (description: string): Cypress.Chainable<any> =>
  this.getPetDescriptionInput().type(description);

selectVaccinatedCheckbox = (): Cypress.Chainable<any> =>
  this.getVaccinatedCheckbox().click();

selectMedicalPapersCheckbox = (): Cypress.Chainable<any> =>
  this.getMedicalPapersCheckbox().click();

clickSubmitButton = (): Cypress.Chainable<any> =>
  this.getSubmitAnimalButton().click();

assertSubmitButtonEnabled = (): Cypress.Chainable<any> =>
  this.getSubmitAnimalButton().should('not.be.disabled');

assertSubmitButtonDisabled = (): Cypress.Chainable<any> =>
  this.getSubmitAnimalButton().should('be.disabled');

uploadImage(filePath: string): Cypress.Chainable<any> {
  return this.getImageUpload().selectFile(filePath, { force: true });
}
}
