import { invalidLoginCredentials } from "../../utils/interfaces/signinInterface";

export const signinScenarios: Record<string, invalidLoginCredentials> = {
  success: {
    email: "admin@commerce.test",
    password: "Commerce@123",
  },

  Invalid_Email: {
    email: "inva@lid@email.com",
    password: "Commerce@123",
  },

  Invalid_Password: {
    email: "admin@commerce.test",
    password: "asdfghj",
  },

  Invalid_Email_Password: {
    email: "inva@lid@email.com",
    password: "345673",
  },

  Empty_Email: {
    email: "",
    password: "Commerce@123",
  },

  Empty_Password: {
    email: "admin@commerce.test",
    password: "",
  },

  Empty_Email_Password: {
    email: "",
    password: "",
  },

  Invalid_Email_Format: {
    email: "admincommerce.test",
    password: "Commerce@123",
  },

  Email_With_Spaces: {
    email: " admin@commerce.test ",
    password: "Commerce@123",
  },

  Password_With_Spaces: {
    email: "admin@commerce.test",
    password: " Commerce@123 ",
  },
};