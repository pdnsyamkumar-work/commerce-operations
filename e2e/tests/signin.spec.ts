import { test, expect } from "../fixtures/base.fixtures";
import { SigninPage } from "../pages/signinPage";
import { userSigninData } from "../testdata/userData";
import { InlineError } from "../enums/component-enum/InlineError.enum";

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
      InlineError.VALID_EMAIL,
    );
  });
  test("verify with empty email", async ({ signinPage }) => {
    await signinPage.signin(userSigninData.emptyEmail);
    await signinPage.clicksignIn();
    await expect(signinPage.getEmailError()).toHaveText(
      InlineError.EMAIL_REQUIRED,
    );
  });
  test("verify with empty password", async ({ signinPage }) => {
    await signinPage.signin(userSigninData.emptyPassword);
    await signinPage.clicksignIn();
    await expect(signinPage.getInvalidCredentialsError()).toHaveText(
      InlineError.INVALID_CREDENTIALS,
    );
  });
  test("verify with invalid credentials", async ({ signinPage }) => {
    await signinPage.signin(userSigninData.invalidCredentials);
    await signinPage.clicksignIn();
    await expect(signinPage.getInvalidCredentialsError()).toHaveText(
      InlineError.INVALID_CREDENTIALS,
    );
  });
});
