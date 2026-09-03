import { invalidLoginCredentials } from "../../utils/interfaces/signinInterface";
import { faker } from "@faker-js/faker";

export class LoginTestData {

  createLoginTestData({
    overrides = {},
    excludes = [],
  }: {
    overrides?: Partial<invalidLoginCredentials>;
    excludes?: (keyof invalidLoginCredentials)[];
  }): invalidLoginCredentials {

    const newLoginData: invalidLoginCredentials = {
      email: excludes.includes("email")
        ? ""
        : faker.internet.email(),

      password: excludes.includes("password")
        ? ""
        : faker.internet.password(),
    };

    return {
      ...newLoginData,
      ...overrides,
    };
  }

  // Valid login
  success() {
    return this.createLoginTestData({
      overrides: {
        email: "admin@commerce.test",
        password: "Commerce@123",
      },
    });
  }

  // Invalid email
  invalidEmail() {
    return this.createLoginTestData({
      overrides: {
        email: "inva@lid@email.com",
        password: "Commerce@123",
      },
    });
  }

  // Invalid password
  invalidPassword() {
    return this.createLoginTestData({
      overrides: {
        email: "admin@commerce.test",
        password: faker.internet.password(),
      },
    });
  }

  // Invalid email and password
  invalidEmailPassword() {
    return this.createLoginTestData({
      overrides: {
        email: "inva@lid@email.com",
        password: faker.internet.password(),
      },
    });
  }

  // Empty email
  emptyEmail() {
    return this.createLoginTestData({
      excludes: ["email"],
      overrides: {
        password: "Commerce@123",
      },
    });
  }

  // Empty password
  emptyPassword() {
    return this.createLoginTestData({
      excludes: ["password"],
      overrides: {
        email: "admin@commerce.test",
      },
    });
  }

  // Empty email and password
  emptyEmailPassword() {
    return this.createLoginTestData({
      excludes: ["email", "password"],
    });
  }

  // Invalid email format
  invalidEmailFormat() {
    return this.createLoginTestData({
      overrides: {
        email: faker.string.alpha(10),
        password: "Commerce@123",
      },
    });
  }

  // Email with spaces
  emailWithSpaces() {
    return this.createLoginTestData({
      overrides: {
        email: ` ${faker.internet.email()} `,
        password: "Commerce@123",
      },
    });
  }

  // Password with spaces
  passwordWithSpaces() {
    return this.createLoginTestData({
      overrides: {
        email: "admin@commerce.test",
        password: ` ${faker.internet.password()} `,
      },
    });
  }
}

// FEEDBACK: Keep all the overrides inside the function implenmented in above class and do the same for all other testdata classes

export const loginTestData = new LoginTestData();

export const signinScenarios = {
  success: loginTestData.success(),

  Invalid_Email: loginTestData.invalidEmail(),

  Invalid_Password: loginTestData.invalidPassword(),

  Invalid_Email_Password: loginTestData.invalidEmailPassword(),

  Empty_Email: loginTestData.emptyEmail(),

  Empty_Password: loginTestData.emptyPassword(),

  Empty_Email_Password: loginTestData.emptyEmailPassword(),

  Invalid_Email_Format: loginTestData.invalidEmailFormat(),

  Email_With_Spaces: loginTestData.emailWithSpaces(),

  Password_With_Spaces: loginTestData.passwordWithSpaces(),
};