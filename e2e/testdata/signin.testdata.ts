import { Faker } from "@faker-js/faker";
import { signinData } from "../interfaces/userData";

export function createSigninTestdata(
  overrides?: Partial<signinData>,
): signinData {
  const signindata: signinData = {
    email: "admin@commerce.test",
    password: "Commerce@123",
  };
  return {
    ...signindata,
    ...overrides,
  };
    // FEEDBACK: Missing Exclusions Logic

}
