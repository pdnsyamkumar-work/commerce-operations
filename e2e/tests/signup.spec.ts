import { test, expect } from '@playwright/test';
import { SignupPage } from '../pageobject/signup';
import { signUpScenarios } from './testData/signUpScenarios';

test.describe("Sign Up Page", () => {

  test.beforeEach(async ({ page }) => {
    const signup = new SignupPage(page);
    await signup.navigate("http://localhost:3000/");
  });

  test("User should be able to create an account successfully", async ({ page }) => {
    const signup = new SignupPage(page);

    const user = signUpScenarios.success;

    await signup.clickSignUp();
    await signup.enterFullName(user.fullName);
    await signup.enterWorkEmail(user.workEmail);
    await signup.enterCompanyName(user.companyName);
    await signup.enterPassword(user.password);
    await signup.enterConfirmPassword(user.password);

    const responsePromise = signup.waitForSignupApi();

    await signup.clickCreateAccount();

    const response = await responsePromise;

    expect(response.status()).toBe(201);
  });

  test("User should see error message for existing email", async ({ page }) => {
    const signup = new SignupPage(page);

    const user = signUpScenarios.existingUser;

    await signup.createAccount(
      user.fullName,
      user.workEmail,
      user.companyName,
      user.password
    );

    await expect(
      page.getByText(
        "A user with this email already exists.",
        { exact: true }
      )
    ).toBeVisible();
  });

  test("User should see validation message for invalid email", async ({ page }) => {
    const signup = new SignupPage(page);

    const user = signUpScenarios.invalidEmail;

    await signup.createAccount(
      user.fullName,
      user.workEmail,
      user.companyName,
      user.password
    );

    await expect(
      page.getByText(
        "Enter a valid work email address.",
        { exact: true }
      )
    ).toBeVisible();
  });

});