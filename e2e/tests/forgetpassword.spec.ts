import { test, expect } from "../fixtures/fixtures";
import { forgetPassword } from './testData/forgetpasswordScenarios';
import { ErrorFields } from '../enums/inlineErrors.enums';

test.describe("Forgot Password Page", () => {

 
  test("User should be able to reset password successfully", async ({ forgotPasswordPage }) => {
   

    const user = forgetPassword.success;

    await forgotPasswordPage.forgotPassword(user.email);

    await expect(forgotPasswordPage.getSuccessMessage()).toContainText(
      "Password reset instructions were sent to"
    );

    await expect(forgotPasswordPage.getSuccessMessage()).toContainText(
      user.email
    );
  });

  test("User should see validation message for invalid email", async ({ forgotPasswordPage }) => {
    

    const user = forgetPassword.Invalid_Email;

    await forgotPasswordPage.forgotPassword(user.email);

    await expect(
      forgotPasswordPage.errormessage.getErrorMessage(
        ErrorFields.SIGNIN_EMAIL
      )
    ).toHaveText("Enter a valid work email address.");
  });

  test("User should see validation message for empty email", async ({ forgotPasswordPage }) => {
    

    const user = forgetPassword.Empty_Email;

    await forgotPasswordPage.forgotPassword(user.email);

    await expect(
      forgotPasswordPage.errormessage.getErrorMessage(
        ErrorFields.SIGNIN_EMAIL
      )
    ).toHaveText("Work email is required.");
  });

});