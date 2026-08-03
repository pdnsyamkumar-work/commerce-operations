import { test, expect } from "@playwright/test";
import { testData } from "../testdata/sign-in-data";
import SignInPage from "../Pages/sign-in-page";
import { Buttons, ErrorField } from "../enums/component_enums/labes_enums";
import { ErrorMessage } from "../Components/Error_message_comp";

test.describe("Sign In Module", () => {
  let signInPage: SignInPage; //let creates a variable.

  test.beforeEach(async ({ page }) => {
    // page refers which represents one browser tab.
    signInPage = new SignInPage(page); //creates a SignInPage object.

    await test.step("Launch the application", async () => {
      await signInPage.navigate();
    });
  });

  test("Verify user can login successfully", async () => {
    await test.step("Enter valid credentials and click Sign In.", async () => {
      await signInPage.login(testData.adminUser);
    });

    await test.step("Verify the dashboard is displayed", async () => {
      await expect(
        signInPage.button.getButton(Buttons.PROFILE_DROPDOWN),
      ).toBeVisible();
    });
  });

  test("Verify user can logout successfully", async () => {
    await test.step("Login with valid credentials", async () => {
      await signInPage.login(testData.adminUser);
    });

    await test.step("Logout from the application.", async () => {
      await expect(
        signInPage.button.getButton(Buttons.PROFILE_DROPDOWN),
      ).toBeVisible();

      await signInPage.logout();
    });

    await test.step("Verify the Sign In page is displayed after logout", async () => {
      await expect(signInPage.button.getButton(Buttons.SIGN_IN)).toBeVisible();
    });
  });

  test("Verify error message for invalid login", async () => {
    await test.step("Enter invalid credentials and click Sign In.", async () => {
      await signInPage.login(testData.invalidUser);
    });

    await test.step("Verify the invalid credentials message.", async () => {
      await expect(
        signInPage.errormessage.getErrorMessage(ErrorField.LOGIN_ERROR),
      ).toBeVisible();
    });
  });
});
