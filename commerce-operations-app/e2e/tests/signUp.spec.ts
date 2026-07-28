import { expect, test } from "@playwright/test";
import { SignUpPage } from "../pageObjects/signUpPage";
import { SignUpdata } from "./test-data/signUPScenarios";

let signup: SignUpPage;

test.describe("Signup tests", () => {
  test.beforeEach(async ({ page }) => {
    signup = new SignUpPage(page);
    console.log(SignUpPage);
    await page.goto("http://localhost:3000/");
  });

  test("User should successfully create account", async () => {
    const user = SignUpdata.success;
    await signup.signUpClick();
    await signup.fillTheForm(
      user.fullName,
      user.workEmail,
      user.companyName,
      user.password,
      user.confirmPassword,
    );
    const responsePromise = signup.waitForsignUpAPI();
    await signup.clickOnCreateAccount();
    const response = await responsePromise;
    expect(response.status()).toBe(201);
    await expect(signup.getCommerceTitle()).toBeVisible();
  });

  test("User should not be able to sign up with existing email", async () => {
    const user = SignUpdata.existingUser;
    await signup.signUpClick();
    await signup.fillTheForm(
      user.fullName,
      user.workEmail,
      user.companyName,
      user.password,
      user.confirmPassword,
    );
    await signup.clickOnCreateAccount();
    await expect(signup.getCommerceTitle()).not.toBeVisible();
  });

  test("User should not be able to sign up when passwords do not match", async () => {
    const user = SignUpdata.passwordMismatch;
    await signup.signUpClick();
    await signup.fillTheForm(
      user.fullName,
      user.workEmail,
      user.companyName,
      user.password,
      user.confirmPassword,
    );
    await signup.clickOnCreateAccount();
    await expect(signup.getCommerceTitle()).not.toBeVisible();
  });
});
