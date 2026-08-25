import {  expect} from "@playwright/test";
import { loginScenarios } from "./test-data/signInScenarios";
import { Buttons } from "../enums/buttons";
import { ErrorFields } from "../enums/inLineErrors";
import { test } from "../Fixtures/fixtures";

test.describe("Login test cases", () => {
  
  test("User should successfully sign in with valid credentials", async ({signinPage}) => {
    const user = loginScenarios.success;
    await signinPage.fillLoginCredentials(user.email,user.password);
    const responsePromise = signinPage.waitForLoginApi();
    await expect(signinPage.button.getButton(Buttons.SIGN_IN_BUTTON)).toBeEnabled();
    await signinPage.clickOnSignInButton();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    await expect(signinPage.getTitle()).toBeVisible();
  });

  test("User should not be able to sign in with an invalid password", async ({signinPage}) => {
    const user = loginScenarios.Invalid_password;
    await signinPage.fillLoginCredentials(user.email,user.password);
    await signinPage.clickOnSignInButton();
    await expect(signinPage.errorField.getErrorMessage(ErrorFields.INVALID_CREDENTIALS)).toHaveText("Invalid email or password.");
    
  });

  test("User should not be able to sign in with an invalid email and password", async ({signinPage}) => {
    const user = loginScenarios.Invalid_email_password;
    await signinPage.fillLoginCredentials(user.email,user.password);
    await signinPage.clickOnSignInButton();
    await expect(signinPage.errorField.getErrorMessage(ErrorFields.INVALID_CREDENTIALS)).toHaveText("Invalid email or password.");
  });
  
  test("User should not be able to sign in with empty email", async ({signinPage}) => {
    const user = loginScenarios.Empty_Email;
    await signinPage.fillLoginCredentials(user.email,user.password);
    await signinPage.clickOnSignInButton();
    await expect(signinPage.errorField.getErrorMessage(ErrorFields.SIGNIN_EMAIL)).toBeVisible();
  });

  test("User should not be able to sign in with empty credentials", async ({signinPage}) => {
    const user = loginScenarios.Empty_Email_password;
    await signinPage.fillLoginCredentials(user.email,user.password);
    await signinPage.clickOnSignInButton();
    await expect(signinPage.errorField.getErrorMessage(ErrorFields.SIGNIN_EMAIL)).toBeVisible();
  });
})
