import { test,expect } from "../Fixtures/fixtures";
import { loginScenarios } from "./test-data/signInScenarios";

test.describe("Sign In", () => {


  test("User should successfully sign in with valid credentials", async ({signInPage}) => {
    const user = loginScenarios.success;
    await signInPage.enterEmail(user.email);
    await signInPage.enterPassword(user.password);
    const responsePromise = signInPage.waitForLoginApi();
    await expect(signInPage.getSignInButton()).toBeEnabled();
    await signInPage.clickOnSignIn();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    await expect(signInPage.getTitle()).toBeVisible();
  });

  test("User should not be able to sign in with an invalid password", async ({signInPage}) => {
    const user = loginScenarios.Invalid_password;
    await signInPage.enterEmail(user.email);
    await signInPage.enterPassword(user.password);
    await signInPage.clickOnSignIn();
    await expect(signInPage.getInvalidEmailPasswordError()).toBeVisible();
  });

  test("User should not be able to sign in with an invalid email and password", async ({signInPage}) => {
    const user = loginScenarios.Invalid_email_password;
    await signInPage.enterEmail(user.email);
    await signInPage.enterPassword(user.password);
    await signInPage.clickOnSignIn();
    await expect(signInPage.getInvalidEmailPasswordError()).toBeVisible();
  });
  test.only("User should not be able to sign in with empty email", async ({signInPage}) => {
    const user = loginScenarios.Empty_Email;
    await signInPage.enterEmail(user.email);
    await signInPage.enterPassword(user.password);
    await signInPage.clickOnSignIn();
    await expect(signInPage.getEmailRequiredError()).toBeVisible();
  });

  test("User should not be able to sign in with empty crredentials", async ({signInPage}) => {
    const user = loginScenarios.Empty_Email_Password;
    await signInPage.enterEmail(user.email);
    await signInPage.enterPassword(user.password);
    await signInPage.clickOnSignIn();
    await expect(signInPage.getEmptyCredentialsError()).toBeVisible();
  });
});
