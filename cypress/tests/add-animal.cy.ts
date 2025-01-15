import { Header } from "../support/page-objects/header";
import { MainPage } from "../support/page-objects/mainpage";
import { AddAnimal } from "../support/page-objects/add-animal";
import { add, head } from "cypress/types/lodash";

describe('Add Animal', () => {
    const mainPage = new MainPage();
    const header = new Header();
    const addAnimalPage = new AddAnimal();
    const viewports = ['desktop', 'mobile'] as const;

    viewports.forEach((viewport) => {
        describe(`Viewport: ${viewport}`, () => {
            beforeEach(() => {
                cy.viewport(viewport === 'desktop' ? 'macbook-15' : 'iphone-6');
                cy.visitHomePage();
                if (viewport === 'mobile') {
                    header.openMenu();
                    header.loginMobileButton().click();
                }
                else {
                    header.loginDesktopButton().click();
                }
                cy.loginAuth0();
            });

            it('should add an animal', () => {
                mainPage.assertAddAnimalButtonIsDisplayedForAuthenticatedUser();
                mainPage.clickAddAnimalButton();

                // Step 1: Select Pet Type
                addAnimalPage.clickPetTypeButton('1');
                addAnimalPage.assertPetTypeSelected('1');
                addAnimalPage.assertStep1NextButtonEnabled();
                addAnimalPage.getStep1NextButton().click();

                // Step 2: Select Placement and Address
                addAnimalPage.clickPlacementButton('1');
                addAnimalPage.getCountrySelect().click();
                addAnimalPage.selectCountryOption('1');
                addAnimalPage.getCitySelect().click();
                addAnimalPage.selectCityOption('1');
                addAnimalPage.typeAddress('Some street 123');
                addAnimalPage.assertStep2NextButtonEnabled();
                addAnimalPage.getStep2NextButton().click();

                // Step 3: Select Gender Type
                addAnimalPage.assertGenderTypeNotSelected(1);
                addAnimalPage.assertStep3NextButtonDisabled();
                addAnimalPage.clickGenderTypeButton(1);
                addAnimalPage.assertGenderTypeSelected(1);
                addAnimalPage.clickStep3NextButton();

                // Step 4: Personality Selection
                addAnimalPage.assertStep4NextButtonDisabled();
                addAnimalPage.clickPersonalityButton(1);
                addAnimalPage.assertPersonalityButtonSelected(1);
                addAnimalPage.assertStep4NextButtonEnabled();
                
                for (let i = 2; i <= 10; i++) {
                    addAnimalPage.clickPersonalityButton(i);
                }

                addAnimalPage.clickPersonalityButton(11);
                addAnimalPage.assertPersonalityButtonNotSelected(11);
                addAnimalPage.clickStep4NextButton();
                // Step 5: Adittional Information
                addAnimalPage.assertSubmitButtonDisabled();
                addAnimalPage.enterPetName('Macho');
                addAnimalPage.enterPetAge('5');
                addAnimalPage.selectPetBreed('1');
                addAnimalPage.enterDescription('A very good friend, loves to play and run.');
                addAnimalPage.selectPetSize('1');
                addAnimalPage.selectMedicalPapersCheckbox();
                addAnimalPage.selectVaccinatedCheckbox();
                addAnimalPage.uploadImage('cypress/assets/tiger.jpg');
                addAnimalPage.assertSubmitButtonEnabled();
            });
        });
    });
});