import type { SignUpData } from "../../utils/interfaces/signUpInterface";
import { faker } from "@faker-js/faker";

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

  success() {
    return this.createSignUpTestData({
      overrides: {
        password: "@Manjula123",
        confirmPassword: "@Manjula123",
      },
    });
  }

  existingUser() {
    return this.createSignUpTestData({
      overrides: {
        workEmail: "admin@commerce.test",
        password: "@Manjula123",
        confirmPassword: "@Manjula123",
      },
    });
  }

  invalidEmail() {
    return this.createSignUpTestData({
      overrides: {
        workEmail: "manjula.com",
        password: "@Manjula123",
        confirmPassword: "@Manjula123",
      },
    });
  }

  invalidPassword() {
    return this.createSignUpTestData({
      overrides: {
        password: "123",
        confirmPassword: "123",
      },
    });
  }

  passwordMismatch() {
    return this.createSignUpTestData({
      overrides: {
        password: "@Manjula123",
        confirmPassword: "@Manjula456",
      },
    });
  }

  emptyFullName() {
    return this.createSignUpTestData({
      excludes: ["fullName"],
      overrides: {
        password: "@Manjula123",
        confirmPassword: "@Manjula123",
      },
    });
  }

  emptyWorkEmail() {
    return this.createSignUpTestData({
      excludes: ["workEmail"],
      overrides: {
        password: "@Manjula123",
        confirmPassword: "@Manjula123",
      },
    });
  }

  emptyCompanyName() {
    return this.createSignUpTestData({
      excludes: ["companyName"],
      overrides: {
        password: "@Manjula123",
        confirmPassword: "@Manjula123",
      },
    });
  }

  emptyPassword() {
    return this.createSignUpTestData({
      excludes: ["password", "confirmPassword"],
    });
  }

  emptyAllFields() {
    return this.createSignUpTestData({
      excludes: [
        "fullName",
        "workEmail",
        "companyName",
        "password",
        "confirmPassword",
      ],
    });
  }
}

export const signUpTestData = new SignUpTestData();

export const signUpScenarios = {

  success: signUpTestData.success(),

  existingUser: signUpTestData.existingUser(),

  invalidEmail: signUpTestData.invalidEmail(),

  invalidPassword: signUpTestData.invalidPassword(),

  passwordMismatch: signUpTestData.passwordMismatch(),

  emptyFullName: signUpTestData.emptyFullName(),

  emptyWorkEmail: signUpTestData.emptyWorkEmail(),

  emptyCompanyName: signUpTestData.emptyCompanyName(),

  emptyPassword: signUpTestData.emptyPassword(),

  emptyAllFields: signUpTestData.emptyAllFields(),
};