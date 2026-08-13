import { expect, test } from "@playwright/test";
import { SignupPage } from "../Pages/signup-page";
import { signupdata } from "../utils/interfaces/signup.interface";
import { signup_data } from "../testdata/signup-data";

test("Signup-valid data ", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const signup = new SignupPage(page);
  await signup.openSignup();
  await signup.fillSignupForm(signup_data[0]);
  await signup.createaccount();
});

test("verify user can able to create account by not entering the work email", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const signup = new SignupPage(page);
  await signup.openSignup();
  await signup.fillSignupForm(signup_data[1]);
  await signup.createaccount();
  await expect(page.getByText("Work email is required.")).toBeVisible();
});

test("verify user can be create account by not any data ", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const signup = new SignupPage(page);
  await signup.openSignup();
  await signup.fillSignupForm(signup_data[2]);
  await signup.createaccount();
  await expect(page.getByText("Work email is required.")).toBeVisible();
  await expect(page.getByText("Password is required.")).toBeVisible();
  await expect(page.getByText("Confirm password is required..")).toBeVisible();
});
