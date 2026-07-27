import { test, expect } from "@playwright/test";
import { ForgotPage } from "../pages/forgotPage";
import { forgotPasswordData } from "../testdata/userData";
let forgot: ForgotPage;
test.describe("verify forgot password", () => {
  test.beforeEach("go to website", async ({ page }) => {
    forgot = new ForgotPage(page);
    await page.goto("http://localhost:3000/");
    await forgot.gotoforgotPassword();
    await expect(forgot.getResetHeading()).toBeVisible();
    await expect(forgot.getForgotEmailTextbox()).toBeVisible();
    await expect(forgot.getForgotEmailTextbox()).toBeEnabled();
  });
  test("reset password with registered email", async ({ page }) => {
    await forgot.forgotPassword(forgotPasswordData.registeredMail.email);
    await forgot.clickresetBtn();
    await expect(
      forgot.getPasswordResetSuccessMessage(
        forgotPasswordData.registeredMail.email,
      ),
    ).toBeVisible();
  });
  // test('reset password with unregistered email',async({page})=>{
  //       await signup.forgotPassword(forgotPasswordData.unregisteredMail.email);
  //       await expect(page.getByText(forgotPasswordData.unregisteredMail.expected)).toBeVisible();
  // });
  test("reset password with invalid email", async ({ page }) => {
    await forgot.forgotPassword(forgotPasswordData.invalidEmail.email);
    await forgot.clickresetBtn();
    await expect(forgot.getEmailError()).toHaveText(
      forgotPasswordData.invalidEmail.expected,
    );
  });
});
