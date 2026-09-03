import { forgetPasswordElements } from "../../utils/interfaces/forgetpasswordInterface";
import { faker } from "@faker-js/faker";

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

  success() {
    return this.createForgotPasswordTestData({
      overrides: {
        email: "manjula@commerce.test",
      },
    });
  }

  invalidEmail() {
    return this.createForgotPasswordTestData({
      overrides: {
        email: "invalid@email",
      },
    });
  }

  invalidEmailFormat() {
    return this.createForgotPasswordTestData({
      overrides: {
        email: "manjula@email",
      },
    });
  }

  emptyEmail() {
    return this.createForgotPasswordTestData({
      excludes: ["email"],
    });
  }

  unregisteredEmail() {
    return this.createForgotPasswordTestData({
      overrides: {
        email: `unknown${faker.string.numeric(6)}@commerce.test`,
      },
    });
  }
}

// FEEDBACK: Keep all the overrides inside the function implenmented in above class and do the same for all other testdata classes

export const forgotPasswordTestData = new ForgotPasswordTestData();

export const forgetPassword = {

  success: forgotPasswordTestData.success(),

  Invalid_Email: forgotPasswordTestData.invalidEmail(),

  Invalid_Email_Format: forgotPasswordTestData.invalidEmailFormat(),

  Empty_Email: forgotPasswordTestData.emptyEmail(),

  Unregistered_Email: forgotPasswordTestData.unregisteredEmail(),
};