import { ForgotPwdData } from "../utils/interfaces/forgotpwd.interface";

export const positiveData: ForgotPwdData[] = [
  {
    email: "admin@example.com",
  },
  {
    email: "user@example.com",
  },
];

export const negativeData: ForgotPwdData[] = [
  {
    email: "",
  },
  {
    email: "   ",
  },
];
