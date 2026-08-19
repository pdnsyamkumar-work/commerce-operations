import type { SignUpData } from "../../utils/interfaces/signUpInterface";

const generateWorkEmail = () => {
  return `manjula${Date.now()}@gmail.com`;
};

export const signUpScenarios: Record<string, SignUpData> = {
  success: {
    fullName: "Manjula",
    workEmail: generateWorkEmail(),
    companyName: "CAW",
    password: "@Manjula123",
    confirmPassword: "@Manjula123",
  },

  existingUser: {
    fullName: "Manjula",
    workEmail: "admin@commerce.test",
    companyName: "CAW",
    password: "@Manjula123",
    confirmPassword: "@Manjula123",
  },

  invalidEmail: {
    fullName: "Manjula",
    workEmail: "manjula.com",
    companyName: "CAW",
    password: "@Manjula123",
    confirmPassword: "@Manjula123",
  },

  invalidPassword: {
    fullName: "Manjula",
    workEmail: generateWorkEmail(),
    companyName: "CAW",
    password: "123",
    confirmPassword: "123",
  },

  passwordMismatch: {
    fullName: "Manjula",
    workEmail: generateWorkEmail(),
    companyName: "CAW",
    password: "@Manjula123",
    confirmPassword: "@Manjula456",
  },

  emptyFullName: {
    fullName: "",
    workEmail: generateWorkEmail(),
    companyName: "CAW",
    password: "@Manjula123",
    confirmPassword: "@Manjula123",
  },

  emptyWorkEmail: {
    fullName: "Manjula",
    workEmail: "",
    companyName: "CAW",
    password: "@Manjula123",
    confirmPassword: "@Manjula123",
  },

  emptyCompanyName: {
    fullName: "Manjula",
    workEmail: generateWorkEmail(),
    companyName: "",
    password: "@Manjula123",
    confirmPassword: "@Manjula123",
  },

  emptyPassword: {
    fullName: "Manjula",
    workEmail: generateWorkEmail(),
    companyName: "CAW",
    password: "",
    confirmPassword: "",
  },

  emptyAllFields: {
    fullName: "",
    workEmail: "",
    companyName: "",
    password: "",
    confirmPassword: "",
  },
};