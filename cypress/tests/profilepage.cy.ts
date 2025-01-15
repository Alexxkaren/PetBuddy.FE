import { Header } from '../support/page-objects/header';
import { ProfilePage } from '../support/page-objects/profilepage';

const header = new Header();
const profilePage = new ProfilePage();

describe('Profile Page tests', () => {
  it('test ProfilePage buttons on Desktop', () => {
    cy.scaleForDesktop();
    cy.visitHomePage();
    header.loginDesktopButton().click();
    cy.loginAuth0();

    header.profileDesktopButton().click();
    cy.url().should('include', '/profile');

    profilePage.clickEditBasicInfo();
    profilePage.assertBasicInfoDialogIsDisplayed();
    profilePage.closeDialogWithSubmit();

    profilePage.clickEditContactInfo();
    profilePage.assertContactInfoDialogIsDisplayed();
  });

  it('test ProfilePage buttons on Mobile', () => {
    cy.scaleForMobile();
    cy.visitHomePage();
    header.openMenu();
    header.loginMobileButton().click();
    cy.loginAuth0();

    header.openMenu();
    header.profileMobileButton().click();
    cy.url().should('include', '/profile');

    profilePage.clickEditBasicInfo();
    profilePage.assertBasicInfoDialogIsDisplayed();
    profilePage.closeDialogWithSubmit();

    profilePage.clickEditContactInfo();
    profilePage.assertContactInfoDialogIsDisplayed();
    profilePage.closeDialogWithSubmit();
  });
});
