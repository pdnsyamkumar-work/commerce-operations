import { test, expect } from "@playwright/test";
import { forgetPassword } from "../pageObjects/forgetPassword";
import { forgetpassword } from "./test-data/forgetPasswordScenarios";

test.describe("ForgetPassword test cases", () => {
  let forgetpasswordCls: forgetPassword;
  test.beforeEach("Login URL", async ({ page }) => {
    forgetpasswordCls = new forgetPassword(page);
    await page.goto("http://localhost:3000/");
  });

  test("Forget password sccess flow", async ({page}) => {
    const user = forgetpassword.success;
    await forgetpasswordCls.clickOnForgetPassword();
    await forgetpasswordCls.enterEmail(user.email);
    await forgetpasswordCls.clickOnSendResetLink();
    await expect(forgetpasswordCls.getSuccessMsg()).toBeVisible();
  });

  test("Forget password without email", async () => {
    const user = forgetpassword.Empty_email;
    await forgetpasswordCls.clickOnForgetPassword();
    await forgetpasswordCls.enterEmail(user.email);
    await forgetpasswordCls.clickOnSendResetLink();
    await expect(forgetpasswordCls.getErrorMsg()).toBeVisible();
  });
});
