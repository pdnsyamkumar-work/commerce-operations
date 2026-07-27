import { SignInData } from "../utils/interfaces/sign_in.interface";

export const testData: Record<string, SignInData> = {
  adminUser: {
    email: "admin@commerce.test",
    password: "Commerce@123",
  },

  invalidUser: {
    email: "admin@commerce.test",
    password: "WrongPassword",
  },

  blankUser: {
    email: "",
    password: "",
  },
};
