import { test, expect } from '@playwright/test';
import { ForgotPasswordPage } from '../pageobject/fogetpassword';
import { forgetPassword } from './testData/forgetpasswordScenarios';

test.describe("Forgot Password Page", () => {

  test.beforeEach(async ({ page }) => {
    const forgotPassword = new ForgotPasswordPage(page);
    await forgotPassword.navigate("http://localhost:3000/");
  });
test("User should be able to reset password successfully", async ({ page }) => {
  const forgotPassword = new ForgotPasswordPage(page);

  const user = forgetPassword.success;

  await forgotPassword.forgotPassword(user.email);

  await expect(forgotPassword.getSuccessMessage()).toContainText(
    "Password reset instructions were sent to"
  );

  await expect(forgotPassword.getSuccessMessage()).toContainText(
    user.email
  );
});

  test("User should see validation message for invalid email", async ({ page }) => {
    const forgotPassword = new ForgotPasswordPage(page);

    const user = forgetPassword.Invalid_Email;

    await forgotPassword.forgotPassword(user.email);

    await expect(
      page.getByText("Enter a valid work email address.", { exact: true })
    ).toBeVisible();
  });

  

  test("User should see validation message for empty email", async ({ page }) => {
    const forgotPassword = new ForgotPasswordPage(page);

    const user = forgetPassword.Empty_Email;

    await forgotPassword.forgotPassword(user.email);

    await expect(
      page.getByText("Work email is required.", { exact: true })
    ).toBeVisible();
  });

  

});