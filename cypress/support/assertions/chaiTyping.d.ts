declare global {
  namespace Chai {
    interface Assertion {
      new (obj: any): Assertion;

      _obj: any;
      assert: (
        expression: boolean,
        message: string,
        negativeMessage: string,
        expected: any,
        actual: any,
        showDiff?: boolean,
      ) => void;
    }

    interface ChaiStatic {
      Assertion: Assertion;
    }
  }
}

export {};
