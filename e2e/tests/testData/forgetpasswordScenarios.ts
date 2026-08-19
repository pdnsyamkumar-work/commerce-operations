import { forgetPasswordElements } from "../../utils/interfaces/forgetpasswordInterface";

export const forgetPassword: Record<string, forgetPasswordElements> = {
  success: {
    email: "manjula@commerce.test",
  },

  Invalid_Email: {
    email: "invalid@email",
  },

  Invalid_Email_Format: {
    email: "manjula@email",
  },

  Empty_Email: {
    email: "",
  },

  Unregistered_Email: {
    email: "unknown@commerce.test",
  },
};