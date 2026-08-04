import { test, expect } from "../fixtures/base.fixtures";
import { userSignupData } from "../testdata/userData";

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
      "Full name is required.",
    );
  });
  test("verify signup without email", async ({ signup }) => {
    await signup.signup(userSignupData.emptyEmail);
    await signup.clickCreateBtn();
    await expect(signup.getEmailError()).toHaveText(
      userSignupData.emptyEmail.expected,
    );
  });
  test("verify signup with invalid email", async ({ signup }) => {
    await signup.signup(userSignupData.invalidEmail);
    await signup.clickCreateBtn();
    await expect(signup.getEmailError()).toHaveText(
      userSignupData.invalidEmail.expected,
    );
  });
  test("verify signup without company name", async ({ signup }) => {
    await signup.signup(userSignupData.emptyCompany);
    await signup.clickCreateBtn();
    await expect(signup.getCompanyError()).toHaveText(
      userSignupData.emptyCompany.expected,
    );
  });
  test("verify signup without password", async ({ signup }) => {
    await signup.signup(userSignupData.emptyPassword);
    await signup.clickCreateBtn();
    await expect(signup.getPasswordError()).toHaveText(
      userSignupData.emptyPassword.expected,
    );
  });
  test("verify signup without confirm password", async ({ signup }) => {
    await signup.signup(userSignupData.emptyCnfPassword);
    await signup.clickCreateBtn();
    await expect(signup.getCnfPasswordError()).toHaveText(
      userSignupData.emptyCnfPassword.expected,
    );
  });
  test("verify signup with short password", async ({ signup }) => {
    await signup.signup(userSignupData.shortPassword);
    await signup.clickCreateBtn();
    await expect(signup.getPasswordError()).toHaveText(
      userSignupData.shortPassword.expected,
    );
  });

  test("verify signup with password mismatch", async ({ signup }) => {
    await signup.signup(userSignupData.passwordMismatch);
    await signup.clickCreateBtn();
    await expect(signup.getCnfPasswordError()).toHaveText(
      userSignupData.passwordMismatch.expected,
    );
  });
  // test('verify signup with existing user',async({page})=>{
  //     await signup.signup(userSignupData.existingUser);
  //     await expect(page.getByText(userSignupData.existingUser.expected)).toBeVisible();
  // });
});
