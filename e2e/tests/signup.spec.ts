import { test, expect } from "../fixtures/base.fixtures";
import { userSignupData } from "../testdata/userData";
import { InlineError } from "../enums/component-enum/InlineError.enum";

test.describe("verify signup", () => {
  test("verify signup valid data", async ({ signup }) => {
    await signup.signup(userSignupData.validData);
    await signup.clickCreateBtn();
    await expect(signup.getDashboardHeading()).toBeVisible();
  });
  test("verify signup without name", async ({ signup }) => {
    await signup.signup(userSignupData.emptyName);
    await signup.clickCreateBtn();
    await expect(signup.getFullNameError()).toHaveText(
      InlineError.NAME_REQUIRED
    );
  });
  test("verify signup without email", async ({ signup }) => {
    await signup.signup(userSignupData.emptyEmail);
    await signup.clickCreateBtn();
    await expect(signup.getEmailError()).toHaveText(
      InlineError.WORK_EMAIL_REQUIRED,
    );
  });
  test("verify signup with invalid email", async ({ signup }) => {
    await signup.signup(userSignupData.invalidEmail);
    await signup.clickCreateBtn();
    await expect(signup.getEmailError()).toHaveText(
      InlineError.VALID_WORK_EMAIL,
    );
  });
  test("verify signup without company name", async ({ signup }) => {
    await signup.signup(userSignupData.emptyCompany);
    await signup.clickCreateBtn();
    await expect(signup.getCompanyError()).toHaveText(
      InlineError.COMPANY_REQUIRED,
    );
  });
  test("verify signup without password", async ({ signup }) => {
    await signup.signup(userSignupData.emptyPassword);
    await signup.clickCreateBtn();
    await expect(signup.getPasswordError()).toContainText([
    InlineError.PASSWORD_REQUIRED,InlineError.PASSWORD_MISMATCH]
    );
  });
  test("verify signup without confirm password", async ({ signup }) => {
    await signup.signup(userSignupData.emptyCnfPassword);
    await signup.clickCreateBtn();
    await expect(signup.getCnfPasswordError()).toHaveText(
      InlineError.CONFIRM_PASSWORD_REQUIRED,
    );
  });
  test("verify signup with short password", async ({ signup }) => {
    await signup.signup(userSignupData.shortPassword);
    await signup.clickCreateBtn();
    await expect(signup.getPasswordError()).toHaveText([
      InlineError.PASSWORD_TOO_SHORT,InlineError.PASSWORD_MISMATCH]
    );
  });

  test("verify signup with password mismatch", async ({ signup }) => {
    await signup.signup(userSignupData.passwordMismatch);
    await signup.clickCreateBtn();
    await expect(signup.getCnfPasswordError()).toHaveText(
      InlineError.PASSWORD_MISMATCH,
    );
  });
  // test('verify signup with existing user',async({page})=>{
  //     await signup.signup(userSignupData.existingUser);
  //     await expect(page.getByText(userSignupData.existingUser.expected)).toBeVisible();
  // });
});
