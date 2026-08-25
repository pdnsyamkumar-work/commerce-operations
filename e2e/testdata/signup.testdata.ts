import { faker } from "@faker-js/faker";
import { signupData } from "../interfaces/userData";

export function createSignupTestdata(
  overrides: Partial<signupData> = {},
): signupData {
  const signup: signupData = {
    fullName: "Bharath",
    email: "bharath@gmail.com",
    companyName: "Bharath Pvt Ltd",
    password: "Bharath@12",
    confirmPassword: "Bharath@12",
  };
  return { ...signup, ...overrides };
    // FEEDBACK: Missing Exclusions Logic

}
