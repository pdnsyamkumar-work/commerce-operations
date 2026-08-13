import { test, expect } from "@playwright/test";
import { ForgotPasswordPage } from "../Pages/forgot-pwd-page";
import { ForgotPwdData } from "../utils/interfaces/forgot-pwd.interface";
import { forgot_password_data } from "../testdata/forgot-pwd-data";

test.describe("Forgot Password Tests", () => {
  test("Reset Password Flow", async ({ page }) => {
    const forgotPage = new ForgotPasswordPage(page);

    for (const data of forgot_password_data) {
      await forgotPage.goto();
      await forgotPage.navigateToForgotPassword();

      await forgotPage.resetPassword(data.email);
      await expect(
        page.getByRole("heading", { name: "Reset password" }),
      ).toBeVisible();
    }
  });
});
