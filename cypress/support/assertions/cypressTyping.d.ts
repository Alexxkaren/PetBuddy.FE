declare global {
  namespace Cypress {
    interface Chainer<Subject> {
      (chainer: 'have.textTrimmed'): Chainable<Subject>;
    }
  }
}

export {};
