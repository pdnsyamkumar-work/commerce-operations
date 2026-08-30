import { invalidLoginCredentials } from "../../utils/interfaces/signinInterface";
import { faker } from "@faker-js/faker";

/*
  Overrides are used to override the default test data.
  Excludes are used to exclude fields from the default test data.
*/

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
}

export const loginTestData = new LoginTestData();

export const signinScenarios = {

  success: loginTestData.createLoginTestData({
    overrides: {
      email: "admin@commerce.test",
      password: "Commerce@123",
    },
  }),

  Invalid_Email: loginTestData.createLoginTestData({
    overrides: {
      email: "inva@lid@email.com",
      password: "Commerce@123",
    },
  }),

  Invalid_Password: loginTestData.createLoginTestData({
    overrides: {
      email: "admin@commerce.test",
      password: faker.internet.password(),
    },
  }),

  Invalid_Email_Password: loginTestData.createLoginTestData({
    overrides: {
      email: "inva@lid@email.com",
      password: faker.internet.password(),
    },
  }),

  Empty_Email: loginTestData.createLoginTestData({
    excludes: ["email"],
    overrides: {
      password: "Commerce@123",
    },
  }),

  Empty_Password: loginTestData.createLoginTestData({
    excludes: ["password"],
    overrides: {
      email: "admin@commerce.test",
    },
  }),

  Empty_Email_Password: loginTestData.createLoginTestData({
    excludes: ["email", "password"],
  }),

  Invalid_Email_Format: loginTestData.createLoginTestData({
    overrides: {
      email: faker.string.alpha(10),
      password: "Commerce@123",
    },
  }),

  Email_With_Spaces: loginTestData.createLoginTestData({
    overrides: {
      email: ` ${faker.internet.email()} `,
      password: "Commerce@123",
    },
  }),

  Password_With_Spaces: loginTestData.createLoginTestData({
    overrides: {
      email: "admin@commerce.test",
      password: ` ${faker.internet.password()} `,
    },
  }),
};