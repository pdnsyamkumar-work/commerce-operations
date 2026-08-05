import { test, expect } from "../fixtures/base.fixtures";
import { ForgotPage } from "../pages/forgotPage";
import { forgotPasswordData } from "../testdata/userData";
import {InlineError} from "../enums/component-enum/InlineError.enum";
test.describe("verify forgot password", () => {
  test("reset password with registered email", async ({ forgot }) => {
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
  test("reset password with invalid email", async ({ forgot }) => {
    await forgot.forgotPassword(forgotPasswordData.invalidEmail.email);
    await forgot.clickresetBtn();
    //await
    await expect(forgot.getEmailError()).toHaveText(
      InlineError.VALID_WORK_EMAIL
    );
  });
});
