import { test, expect } from "@playwright/test";
import { SigninPage } from "../pages/signinPage";
import { userSigninData } from "../testdata/userData";
let signin: SigninPage;
test.describe("verify login", () => {
  test.beforeEach("go to website", async ({ page }) => {
    signin = new SigninPage(page);
    await page.goto("http://localhost:3000/");
    await signin.gotosignin();
    await expect(signin.getSigninEmailTextbox()).toBeVisible();
    await expect(signin.getSigninEmailTextbox()).toBeEnabled();
  });
  test("verify with valid data", async ({ page }) => {
    await signin.signin(userSigninData.validData);
    await signin.clicksignIn();
    await expect(signin.getDashboardHeading()).toBeVisible();
  });
  test("verify with invalid email", async ({ page }) => {
    await signin.signin(userSigninData.invalidEmail);
    await signin.clicksignIn();
    await expect(signin.getEmailError()).toHaveText(
      userSigninData.invalidEmail.expected,
    );
  });
  test("verify with empty email", async ({ page }) => {
    await signin.signin(userSigninData.emptyEmail);
    await signin.clicksignIn();
    await expect(signin.getEmailError()).toHaveText(
      userSigninData.emptyEmail.expected,
    );
  });
  test("verify with empty password", async ({ page }) => {
    await signin.signin(userSigninData.emptyPassword);
    await signin.clicksignIn();
    await expect(signin.invalidCredentialsError).toHaveText(
      userSigninData.emptyPassword.expected,
    );
  });
  test("verify with invalid credentials", async ({ page }) => {
    await signin.signin(userSigninData.invalidCredentials);
    await signin.clicksignIn();
    await expect(signin.invalidCredentialsError).toHaveText(
      userSigninData.invalidCredentials.expected,
    );
  });
});
