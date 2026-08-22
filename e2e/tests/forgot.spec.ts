import { test, expect } from "../fixtures/base.fixtures";
import { ForgotPage } from "../pages/forgotPage";
import { InlineError } from "../enums/component-enum/InlineError.enum";
test.describe("verify forgot password", () => {
  test("reset password with registered email", async ({
    forgot,
    createForgotTestdata,
  }) => {
    const data = createForgotTestdata();
    await forgot.forgotPassword(data.email);
    await forgot.clickresetBtn();
    await expect(
      forgot.getPasswordResetSuccessMessage(data.email),
    ).toBeVisible();
  });
  // test('reset password with unregistered email',async({page})=>{
  //       await signup.forgotPassword(forgotPasswordData.unregisteredMail.email);
  //       await expect(page.getByText(forgotPasswordData.unregisteredMail.expected)).toBeVisible();
  // });
  test("reset password with invalid email", async ({
    forgot,
    createForgotTestdata,
  }) => {
    const data = createForgotTestdata({ email: "bharathtest.com" });
    await forgot.forgotPassword(data.email);
    await forgot.clickresetBtn();
    //await
    await expect(forgot.getEmailError()).toHaveText(
      InlineError.VALID_WORK_EMAIL,
    );
  });
});
