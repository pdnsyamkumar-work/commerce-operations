import { faker } from "@faker-js/faker";
import { signupData } from "../interfaces/userData";

export function createSignupTestdata(
  overrides: Partial<signupData> = {},
  excludes: (keyof signupData)[] = [],
  only: (keyof signupData)[] = [],
): signupData {
  const signup: signupData = {
    fullName: "Bharath",
    email: "bharath@gmail.com",
    companyName: "Bharath Pvt Ltd",
    password: "Bharath@12",
    confirmPassword: "Bharath@12",
  };
  let data = { ...signup, ...overrides };
  if (only.length > 0) {
    Object.fromEntries(only.map((key) => [key, data[key]])) as typeof data;
  }
  for (const field of excludes) {
    delete data[field];
  }

  return data;
  // FEEDBACK: Missing Exclusions Logic
}
