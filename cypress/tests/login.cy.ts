import { Header } from '../support/page-objects/header';

const header = new Header();

describe('OAuth Login', () => {
  it('should log in via Auth0 OAuth on Desktop', () => {
    cy.scaleForDesktop();
    cy.visitHomePage();

    header.loginDesktopButton().click();

    cy.loginAuth0();

    header.profileDesktopButton().should('be.visible');
    header.logoutDesktopButton().should('be.visible');
    header.loginDesktopButton().should('not.exist');
  });

  it('should log in via Auth0 OAuth on Mobile', () => {
    cy.scaleForMobile();
    cy.visitHomePage();

    header.openMenu();
    header.loginMobileButton().click();

    cy.loginAuth0();

    header.openMenu();
    header.profileMobileButton().should('be.visible');
    header.logoutMobileButton().should('be.visible');
    header.loginMobileButton().should('not.exist');
  });
});
