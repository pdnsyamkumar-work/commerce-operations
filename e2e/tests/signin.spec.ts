import { test, expect } from "../fixtures/fixtures";
import { signinScenarios } from "./testData/signinScenarios";
import { ErrorFields } from "../enums/inlineErrors.enums";

test.describe("Sign In Page", () => {

  test("User should successfully sign in with valid credentials", async ({ signinPage, page }) => {
    const user = signinScenarios.success;

    await signinPage.enterEmail(user.email);
    await signinPage.enterPassword(user.password);

    const responsePromise = signinPage.waitForLoginApi();

    await signinPage.clickOnSignIn();

    const response = await responsePromise;

    expect(response.status()).toBe(200);

    await expect(page).toHaveTitle("Commerce Operations");
  });

   test("User should see error message for invalid email", async ({ signinPage }) => {
    const user = signinScenarios.Invalid_Email;
    

    await signinPage.login(user.email, user.password);

    const errorMessage =
      signinPage.errormessage.getErrorMessage(
        ErrorFields.SIGNIN_EMAIL
      );

    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(
      "Enter a valid email address."
    );
  });

   test("User should see error message for invalid password", async ({ signinPage }) => {
    const user = signinScenarios.Invalid_Password;

    await signinPage.enterEmail(user.email);
    await signinPage.enterPassword(user.password);

    await signinPage.clickOnSignIn();

    const errorMessage =
      signinPage.errormessage.getErrorMessage(
        ErrorFields.SIGNIN_PASSWORD
      );

    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(
      "Invalid email or password."
    );
  });

  test("User should see validation message when email is empty", async ({signinPage}) => {
    const user = signinScenarios.Empty_Email;

    await signinPage.login(user.email, user.password);

    const errorMessage =
      signinPage.errormessage.getErrorMessage(
        ErrorFields.SIGNIN_EMAIL
      );

    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(
      "Email address is required."
    );
  });

  test("User should see error message when password is empty", async ({signinPage}) => {
    const user = signinScenarios.Empty_Password;

    await signinPage.login(user.email, user.password);

    const errorMessage =
      signinPage.errormessage.getErrorMessage(
        ErrorFields.SIGNIN_PASSWORD
      );

    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(
      "Invalid email or password."
    );
  });
});