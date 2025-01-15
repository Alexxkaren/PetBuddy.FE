function domShouldExist($element: JQuery) {
  new chai.Assertion($element).to.be.exist;
}

export function textTrimmed(chai: any) {
  chai.Assertion.addMethod(
    'textTrimmed',
    function (this: Chai.Assertion, expectedString: string) {
      const $element: JQuery = this._obj;

      domShouldExist($element);

      const actual = $element.text().trim();
      const expected = expectedString.trim();
      this.assert(
        actual === expected,
        'expected #{this} to have text #{exp} after trimmed, but the text was #{act} after trimmed',
        'expected #{this} not to have text #{exp} after trimmed',
        expected,
        actual,
      );
    },
  );
}
