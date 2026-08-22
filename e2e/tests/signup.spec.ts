import { test, expect } from "../fixtures/base.fixtures";
import { InlineError } from "../enums/component-enum/InlineError.enum";

test.describe("verify signup", () => {
  test("verify signup valid data", async ({ signup, createSignupTestdata }) => {
    const data = createSignupTestdata();
    await signup.signup(data);
    await signup.clickCreateBtn();
    await expect(signup.getDashboardHeading()).toBeVisible();
  });
  test("verify signup without name", async ({
    signup,
    createSignupTestdata,
  }) => {
    const data = createSignupTestdata({ fullName: "" });
    await signup.signup(data);
    await signup.clickCreateBtn();
    await expect(signup.getFullNameError()).toHaveText(
      InlineError.NAME_REQUIRED,
    );
  });
  test("verify signup without email", async ({
    signup,
    createSignupTestdata,
  }) => {
    const data = createSignupTestdata({ email: "" });
    await signup.signup(data);
    await signup.clickCreateBtn();
    await expect(signup.getEmailError()).toHaveText(
      InlineError.WORK_EMAIL_REQUIRED,
    );
  });
  test("verify signup with invalid email", async ({
    signup,
    createSignupTestdata,
  }) => {
    const data = createSignupTestdata({ email: "bharathtest.com" });
    await signup.signup(data);
    await signup.clickCreateBtn();
    await expect(signup.getEmailError()).toHaveText(
      InlineError.VALID_WORK_EMAIL,
    );
  });
  test("verify signup without company name", async ({
    signup,
    createSignupTestdata,
  }) => {
    const data = createSignupTestdata({ companyName: "" });
    await signup.signup(data);
    await signup.clickCreateBtn();
    await expect(signup.getCompanyError()).toHaveText(
      InlineError.COMPANY_REQUIRED,
    );
  });
  test("verify signup without password", async ({
    signup,
    createSignupTestdata,
  }) => {
    const data = createSignupTestdata({ password: "" });
    await signup.signup(data);
    await signup.clickCreateBtn();
    await expect(signup.getPasswordError()).toContainText([
      InlineError.PASSWORD_REQUIRED,
      InlineError.PASSWORD_MISMATCH,
    ]);
  });
  test("verify signup without confirm password", async ({
    signup,
    createSignupTestdata,
  }) => {
    const data = createSignupTestdata({ confirmPassword: "" });
    await signup.signup(data);
    await signup.clickCreateBtn();
    await expect(signup.getCnfPasswordError()).toHaveText(
      InlineError.CONFIRM_PASSWORD_REQUIRED,
    );
  });
  test("verify signup with short password", async ({
    signup,
    createSignupTestdata,
  }) => {
    const data = createSignupTestdata({ password: "Test" });
    await signup.signup(data);
    await signup.clickCreateBtn();
    await expect(signup.getPasswordError()).toHaveText([
      InlineError.PASSWORD_TOO_SHORT,
      InlineError.PASSWORD_MISMATCH,
    ]);
  });

  test("verify signup with password mismatch", async ({
    signup,
    createSignupTestdata,
  }) => {
    const data = createSignupTestdata({
      password: "Test@123",
      confirmPassword: "Wrong@123",
    });
    await signup.signup(data);
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
