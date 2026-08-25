import { SignUpData } from "../../utils/interfaces/signUpInterfaces";
import {faker} from "@faker-js/faker";

export class SignupTestData {
  createSignupTestData({
    overrides = {},
  }: {
    overrides?: Partial<SignUpData>;
  }): SignUpData {
    const defaultSignupData: SignUpData = {
      fullName: faker.person.fullName(),
      workEmail: faker.internet.email(),
      companyName: faker.company.name(),
      password: "@Vishnu123",
      confirmPassword: "@Vishnu123",
    };

    return {
      ...defaultSignupData,
      ...overrides,
    };
  }
}

export const signupTestData = new SignupTestData();

const generateWorkEmail = () => {
  return `PRD-${Date.now()}@gmail.com`;
};
export const SignUpdata: Record<string, SignUpData> = {
  success: {
    fullName: "Vishnu Priya",
    workEmail: generateWorkEmail(),
    companyName: "CAW",
    password: "@Vishnu123",
    confirmPassword: "@Vishnu123",
  },

  existingUser: {
    fullName: "Vishnu",
    workEmail: "admin@commerce.test",
    companyName: "CAW",
    password: "@Vishnu123",
    confirmPassword: "@Vishnu123",
  },

  passwordMismatch: {
    fullName: "Priya",
    workEmail: "priya@gmail.com",
    companyName: "CAW",
    password: "@Vishnu123",
    confirmPassword: "@Vishnu12",
  },

  fillWithoutFullName: {
    fullName: " ",
    workEmail: "priya@gmail.com",
    companyName: "CAW",
    password: "@Vishnu123",
    confirmPassword: "@Vishnu12",
  },

  fillWithoutWrkEmail: {
    fullName: "Priya",
    workEmail: " ",
    companyName: "CAW",
    password: "@Vishnu123",
    confirmPassword: "@Vishnu12",
  },

  fillWithoutCompanyName: {
    fullName: "Priya",
    workEmail: "priya@gmail.com",
    companyName: " ",
    password: "@Vishnu123",
    confirmPassword: "@Vishnu12",
  },

  fillWithoutPassword: {
    fullName: "Priya",
    workEmail: "priya@gmail.com",
    companyName: "CAW",
    password: " ",
    confirmPassword: "@Vishnu12",
  },

  fillWithoutConfirmPassword: {
    fullName: "Priya",
    workEmail: "priya@gmail.com",
    companyName: "CAW",
    password: "@Vishnu123",
    confirmPassword: " ",
  },
};
