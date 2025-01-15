declare namespace Cypress {
  interface Chainable<Subject> {
    assertTranslationIsDisplayed: (
      translationKey: string,
      replacements?: Record<string, string>,
    ) => Chainable<JQuery<HTMLElement>>;
  }
}

Cypress.Commands.add(
  'assertTranslationIsDisplayed',
  { prevSubject: true },
  (subject, translationKey: string, replacements?: Record<string, string>) => {
    cy.readValueFromFile(translationKey).then((translation: string) => {
      if (replacements) {
        for (const [placeholder, replacement] of Object.entries(replacements)) {
          translation = translation.replace(placeholder, replacement);
        }
      }
      cy.wrap(subject).should(
        'have.textTrimmed',
        removeTagsFromTranslation(translation),
      );
    });
  },
);

function removeTagsFromTranslation(text: string): string {
  return text.replaceAll('<strong>', '').replaceAll('</strong>', '');
}
