import { faker } from "@faker-js/faker";
import { forgotPassword } from "../interfaces/userData";

export function createForgotPasswordTestdata(
  overrides: Partial<forgotPassword> = {},
  excludes: (keyof forgotPassword)[] = [],
  only: (keyof forgotPassword)[] = [],
): forgotPassword {
  const forgotTestdata: forgotPassword = {
    email: faker.internet.email(),
  };
  let data: any = {
    ...forgotTestdata,
    ...overrides,
  };
  if (only.length > 0) {
    data = Object.fromEntries(
      only.map((key) => [key, data[key]]),
    ) as typeof data;
  }
  for (const field of excludes) {
    delete data[field];
  }

  return data;

  // FEEDBACK: Missing Exclusions Logic
}
