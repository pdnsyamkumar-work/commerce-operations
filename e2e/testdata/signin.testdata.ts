import { Faker } from "@faker-js/faker";
import { signinData } from "../interfaces/userData";

export function createSigninTestdata(
  overrides?: Partial<signinData>,
  excludes: (keyof signinData)[] = [],
  only: (keyof signinData)[] = [],
): signinData {
  const signindata: signinData = {
    email: "admin@commerce.test",
    password: "Commerce@123",
  };
  let data = {
    ...signindata,
    ...overrides,
  };
  if (only.length > 0) {
    Object.fromEntries(only.map((key) => [key, data[key]])) as typeof data;
  }
  for (const field of excludes) {
    delete data[field];
  }

  return data;

  // FEEDBACK: Missing Exclusions Logic
}
