import type { SignUpData } from "../../utils/interfaces/signUpInterface";
import { faker } from "@faker-js/faker";

/*
  Overrides are used to override the default test data.
  Excludes are used to exclude fields from the default test data.
*/

export class SignUpTestData {
  createSignUpTestData({
    overrides = {},
    excludes = [],
  }: {
    overrides?: Partial<SignUpData>;
    excludes?: (keyof SignUpData)[];
  }): SignUpData {

    const newSignUpData: SignUpData = {
      fullName: excludes.includes("fullName")
        ? ""
        : faker.person.fullName(),

      workEmail: excludes.includes("workEmail")
        ? ""
        : faker.internet.email(),

      companyName: excludes.includes("companyName")
        ? ""
        : faker.company.name(),

      password: excludes.includes("password")
        ? ""
        : faker.internet.password({ length: 12 }),

      confirmPassword: excludes.includes("confirmPassword")
        ? ""
        : faker.internet.password({ length: 12 }),
    };

    return {
      ...newSignUpData,
      ...overrides,
    };
  }
}

export const signUpTestData = new SignUpTestData();

export const signUpScenarios = {

  success: signUpTestData.createSignUpTestData({
    overrides: {
      password: "@Manjula123",
      confirmPassword: "@Manjula123",
    },
  }),

  existingUser: signUpTestData.createSignUpTestData({
    overrides: {
      workEmail: "admin@commerce.test",
      password: "@Manjula123",
      confirmPassword: "@Manjula123",
    },
  }),

  invalidEmail: signUpTestData.createSignUpTestData({
    overrides: {
      workEmail: "manjula.com",
      password: "@Manjula123",
      confirmPassword: "@Manjula123",
    },
  }),

  invalidPassword: signUpTestData.createSignUpTestData({
    overrides: {
      password: "123",
      confirmPassword: "123",
    },
  }),

  passwordMismatch: signUpTestData.createSignUpTestData({
    overrides: {
      password: "@Manjula123",
      confirmPassword: "@Manjula456",
    },
  }),

  emptyFullName: signUpTestData.createSignUpTestData({
    excludes: ["fullName"],
    overrides: {
      password: "@Manjula123",
      confirmPassword: "@Manjula123",
    },
  }),

  emptyWorkEmail: signUpTestData.createSignUpTestData({
    excludes: ["workEmail"],
    overrides: {
      password: "@Manjula123",
      confirmPassword: "@Manjula123",
    },
  }),

  emptyCompanyName: signUpTestData.createSignUpTestData({
    excludes: ["companyName"],
    overrides: {
      password: "@Manjula123",
      confirmPassword: "@Manjula123",
    },
  }),

  emptyPassword: signUpTestData.createSignUpTestData({
    excludes: ["password", "confirmPassword"],
  }),

  emptyAllFields: signUpTestData.createSignUpTestData({
    excludes: [
      "fullName",
      "workEmail",
      "companyName",
      "password",
      "confirmPassword",
    ],
  }),
};