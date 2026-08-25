import { faker } from "@faker-js/faker";
import { forgotPassword } from "../interfaces/userData";

export function createForgotPasswordTestdata(
  overrides: Partial<forgotPassword> = {},
): forgotPassword {
  const forgotTestdata: forgotPassword = {
    email: faker.internet.email(),
  };
  return {
    ...forgotTestdata,
    ...overrides,
  };
    // FEEDBACK: Missing Exclusions Logic

}
