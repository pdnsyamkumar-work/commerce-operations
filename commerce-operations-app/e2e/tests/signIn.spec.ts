import { test, expect} from "@playwright/test";
import { loginScenarios } from "./test-data/signInScenarios";
import { SignInPage } from "../pageObjects/signInPage";
import { Buttons } from "../enums/buttons";

test.describe("Login test cases", () => {
  let signInPage:SignInPage ;
  test.beforeEach("Login URL", async ({ page }) => {
    signInPage = new SignInPage(page);
    await page.goto("http://localhost:3000/");
  });

  test("User should successfully sign in with valid credentials", async ({}) => {
    const user = loginScenarios.success;
    await signInPage.enterEmail(user.email);
    await signInPage.enterPassword(user.password);
    const responsePromise = signInPage.waitForLoginApi();
    await expect(signInPage.button.getButton(Buttons.SIGN_IN_BUTTON)).toBeEnabled();
    await signInPage.clickOnSignIn();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    await expect(signInPage.getTitle()).toBeVisible();
  });

  test("User should not be able to sign in with an invalid password", async ({}) => {
    const user = loginScenarios.Invalid_password;
    await signInPage.enterEmail(user.email);
    await signInPage.enterPassword(user.password);
    await signInPage.clickOnSignIn();
    await expect(signInPage.getInvalidEmailPasswordError()).toBeVisible();
  });

  test("User should not be able to sign in with an invalid email and password", async ({}) => {
    const user = loginScenarios.Invalid_email_password;
    await signInPage.enterEmail(user.email);
    await signInPage.enterPassword(user.password);
    await signInPage.clickOnSignIn();
    await expect(signInPage.getCredentialsError()).toBeVisible();
  });
  
  test("User should not be able to sign in with empty email", async ({}) => {
    const user = loginScenarios.Empty_Email;
    await signInPage.enterEmail(user.email);
    await signInPage.enterPassword(user.password);
    await signInPage.clickOnSignIn();
    await expect(signInPage.getEmailRequiredError()).toBeVisible();
  });

  test("User should not be able to sign in with empty credentials", async ({page}) => {
    const user = loginScenarios.Empty_Email_password;
    await signInPage.enterEmail(user.email);
    await signInPage.enterPassword(user.password);
    await signInPage.clickOnSignIn();
    await expect(signInPage.getCredentialsError()).toBeVisible();
  });
});
