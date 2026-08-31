import { forgetPasswordElements } from "../../utils/interfaces/forgetpasswordInterface";
import { faker } from "@faker-js/faker";

/*
  Overrides are used to override the default test data.
  Excludes are used to exclude fields from the default test data.
*/

export class ForgotPasswordTestData {
  createForgotPasswordTestData({
    overrides = {},
    excludes = [],
  }: {
    overrides?: Partial<forgetPasswordElements>;
    excludes?: (keyof forgetPasswordElements)[];
  }): forgetPasswordElements {

    const newForgotPasswordData: forgetPasswordElements = {
      email: excludes.includes("email")
        ? ""
        : faker.internet.email(),
    };

    return {
      ...newForgotPasswordData,
      ...overrides,
    };
  }
}

// FEEDBACK: Keep all the overrides inside the function implenmented in above class and do the same for all other testdata classes

export const forgotPasswordTestData = new ForgotPasswordTestData();

export const forgetPassword = {

  success: forgotPasswordTestData.createForgotPasswordTestData({
    overrides: {
      email: "manjula@commerce.test",
    },
  }),

  Invalid_Email: forgotPasswordTestData.createForgotPasswordTestData({
    overrides: {
      email: "invalid@email",
    },
  }),

  Invalid_Email_Format: forgotPasswordTestData.createForgotPasswordTestData({
    overrides: {
      email: "manjula@email",
    },
  }),

  Empty_Email: forgotPasswordTestData.createForgotPasswordTestData({
    excludes: ["email"],
  }),

  Unregistered_Email: forgotPasswordTestData.createForgotPasswordTestData({
    overrides: {
      email: `unknown${faker.string.numeric(6)}@commerce.test`,
    },
  }),
};