import { test, expect } from "../fixtures/base.fixtures";
import { SigninPage } from "../pages/signinPage";
import { userSigninData } from "../testdata/userData";
let signin: SigninPage;
test.describe("verify login", () => {
  test("verify with valid data", async ({ signinPage }) => {
    await signinPage.signin(userSigninData.validData);
    await signinPage.clicksignIn();
    await expect(signinPage.getDashboardHeading()).toBeVisible();
  });
  test("verify with invalid email", async ({ signinPage }) => {
    await signinPage.signin(userSigninData.invalidEmail);
    await signinPage.clicksignIn();
    await expect(signinPage.getEmailError()).toHaveText(
      userSigninData.invalidEmail.expected,
    );
  });
  test("verify with empty email", async ({ signinPage }) => {
    await signinPage.signin(userSigninData.emptyEmail);
    await signinPage.clicksignIn();
    await expect(signinPage.getEmailError()).toHaveText(
      userSigninData.emptyEmail.expected,
    );
  });
  test("verify with empty password", async ({ signinPage }) => {
    await signinPage.signin(userSigninData.emptyPassword);
    await signinPage.clicksignIn();
    await expect(signinPage.getInvalidCredentialsError).toHaveText(
      userSigninData.emptyPassword.expected,
    );
  });
  test("verify with invalid credentials", async ({ signinPage }) => {
    await signinPage.signin(userSigninData.invalidCredentials);
    await signinPage.clicksignIn();
    await expect(signinPage.getInvalidCredentialsError).toHaveText(
      userSigninData.invalidCredentials.expected,
    );
  });
});
