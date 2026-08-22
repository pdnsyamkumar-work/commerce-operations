import { test, expect } from "../fixtures/base.fixtures";
import { SigninPage } from "../pages/signinPage";

import { InlineError } from "../enums/component-enum/InlineError.enum";

test.describe("verify login", () => {
  test("verify with valid data", async ({
    signinPage,
    createSigninTestdata,
  }) => {
    const data = createSigninTestdata();
    await signinPage.signin(data);
    await signinPage.clicksignIn();
    await expect(signinPage.getDashboardHeading()).toBeVisible();
  });
  test("verify with invalid email", async ({
    signinPage,
    createSigninTestdata,
  }) => {
    const data = createSigninTestdata({ email: "bharathgmail.com" });
    await signinPage.signin(data);
    await signinPage.clicksignIn();
    await expect(signinPage.getEmailError()).toHaveText(
      InlineError.VALID_EMAIL,
    );
  });
  test("verify with empty email", async ({
    signinPage,
    createSigninTestdata,
  }) => {
    const data = createSigninTestdata({ email: "" });
    await signinPage.signin(data);
    await signinPage.clicksignIn();
    await expect(signinPage.getEmailError()).toHaveText(
      InlineError.EMAIL_REQUIRED,
    );
  });
  test("verify with empty password", async ({
    signinPage,
    createSigninTestdata,
  }) => {
    const data = createSigninTestdata({ password: "" });
    await signinPage.signin(data);
    await signinPage.clicksignIn();
    await expect(signinPage.getInvalidCredentialsError()).toHaveText(
      InlineError.INVALID_CREDENTIALS,
    );
  });
  test("verify with invalid credentials", async ({
    signinPage,
    createSigninTestdata,
  }) => {
    const data = createSigninTestdata({
      email: "bharath123@test.com",
      password: "Test@123",
    });
    await signinPage.signin(data);
    await signinPage.clicksignIn();
    await expect(signinPage.getInvalidCredentialsError()).toHaveText(
      InlineError.INVALID_CREDENTIALS,
    );
  });
});
