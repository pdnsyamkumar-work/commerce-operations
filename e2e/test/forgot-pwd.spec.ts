import { test } from "@playwright/test";
import Forgot_Pwd from "../Pages/forgot-pwd-page";
import { positiveData, negativeData } from "../testdata/forgot-pwd-data";

test.describe("Forgot Password Module", () => {
  let forgotPwd: Forgot_Pwd;

  test.beforeEach(async ({ page }) => {
    forgotPwd = new Forgot_Pwd(page);
  });

  test("Verify password reset for registered email", async () => {
    await forgotPwd.forgotPassword(positiveData);
  });

  test("Verify validation for invalid email inputs", async () => {
    await forgotPwd.forgotPassword(negativeData);
  });
});
