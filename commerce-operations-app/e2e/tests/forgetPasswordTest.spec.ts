import { expect } from "@playwright/test";
import { forgetpassword } from "./test-data/forgetPasswordScenarios";
import { ErrorFields } from "../enums/inLineErrors";
import { test } from "../Fixtures/fixtures";

test.describe("ForgetPassword test cases", () => {
  
  test("Forget password sccess flow", async ({signinPage, forgetPasswordPage }) => {
    const user = forgetpassword.success;
    await forgetPasswordPage.clickOnForgetPassword();
    await forgetPasswordPage.enterEmail(user.email);
    await forgetPasswordPage.clickOnSendResetLink();
    await expect(forgetPasswordPage.getSuccessMsg()).toBeVisible();
  });

  test("Forget password without email", async ({ signinPage, forgetPasswordPage }) => {
    const user = forgetpassword.Empty_email;
    await forgetPasswordPage.clickOnForgetPassword();
    await forgetPasswordPage.enterEmail(user.email);
    await forgetPasswordPage.clickOnSendResetLink();
    await expect(forgetPasswordPage.errorField.getErrorMessage(ErrorFields.FORGET_PASSWORD_EMAIL)).toBeVisible();
  });
});
