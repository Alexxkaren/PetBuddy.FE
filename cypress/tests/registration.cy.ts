import { Language } from '../support/models/language.enum';
import { Registration } from '../support/page-objects/registration';

const viewports = ['desktop', 'mobile'] as const;
const languages: Language[] = [Language.english, Language.slovak];
const registration = new Registration();

describe('Registration and Header tests', () => {
  languages.forEach((language) => {
    describe(`Language: ${language}`, () => {
      beforeEach(() => {
        Cypress.env('currentLanguage', language);
        cy.changeLanguage(language);
      });

      viewports.forEach((viewport) => {
        describe(`Viewport: ${viewport}`, () => {
          beforeEach(() => {
            cy.viewport(viewport === 'desktop' ? 'macbook-15' : 'iphone-6');
          });

          it('should fill registration form and submit', () => {
            let state: string;
            let city: string;

            cy.readValueFromFile('states.2').then((translatedState) => {
              state = translatedState;

              cy.readValueFromFile('cities.142').then((translatedCity) => {
                city = translatedCity;

                registration.fillForm(
                  'Jack',
                  'Sparrow',
                  'jack.sparrow@gmail.com',
                  '1990-01-01',
                  '+421999999999',
                  state,
                  city,
                  'Sunset Boulevard'
                );
                registration.submitButton().should('be.enabled').click();
              });
            });
          });

          it('should show error messages for invalid inputs', () => {
            let state: string;
            let city: string;

            cy.readValueFromFile('states.2').then((translatedState) => {
              state = translatedState;  

              cy.readValueFromFile('cities.142').then((translatedCity) => {
                city = translatedCity;

                registration.fillForm(
                  '9',
                  '9',
                  'invalid-email',
                  '2020-01-01',
                  'invalid-phone',
                  state,
                  city,
                  'Sunset Boulevard'
                );

                registration.submitButton().should('be.disabled');

                if (viewport === 'mobile') {
                  cy.getByTestId('input-register-first-name').scrollIntoView().should('be.visible');
                }

                cy.readValueFromFile('validations.invalid_character').then((text) => {
                  cy.contains(text).should('be.visible');
                });
                cy.readValueFromFile('validations.invalid_email').then((text) => {
                  cy.contains(text).should('be.visible');
                });
                cy.readValueFromFile('validations.age_min').then((text) => {
                  cy.contains(text).should('be.visible');
                });
                cy.readValueFromFile('validations.invalid_format').then((text) => {
                  cy.contains(text).should('be.visible');
                });
              });
            });
          });

          it('should show error messages for empty inputs', () => {
            registration.validateEmptyInputs();
          });
        });
      });
    });
  });
});
