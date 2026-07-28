import { SignUpData } from "../../utils/interfaces/signUpInterfaces";
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
};
