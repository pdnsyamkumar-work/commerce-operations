import { invalidLoginCredentials } from "../../utils/interfaces/signInInterfaces";
export const loginScenarios: Record<string, invalidLoginCredentials> = {
  success: {
    email: "admin@commerce.test",
    password: "Commerce@123",
  },
  Invalid_password: {
    email: "vishnupriya.a@caw.tech",
    password: "@Vishnu12",
  },
  Invalid_email_password: {
    email: "vishnupriya.acaw.tec",
    password: "rtyuio",
  },
  Empty_Email: {
    email: " ",
    password: "Commerce@123",
  },
  Empty_Email_password: {
    email: " ",
    password: " ",
  },
};
