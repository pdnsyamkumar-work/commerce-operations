import { test, expect } from "../fixtures/fixtures";
import { signUpScenarios } from './testData/signUpScenarios';
import { ErrorFields } from "../enums/inlineErrors.enums";

test.describe("Sign Up Page", () => {

  test("User should be able to create an account successfully", async ({ signUpPage }) => {
    const user = signUpScenarios.success;

    await signUpPage.clickSignUp();
    await signUpPage.enterFullName(user.fullName);
    await signUpPage.enterWorkEmail(user.workEmail);
    await signUpPage.enterCompanyName(user.companyName);
    await signUpPage.enterPassword(user.password);
    await signUpPage.enterConfirmPassword(user.password);

    const responsePromise = signUpPage.waitForSignupApi();

    await signUpPage.clickCreateAccount();

    const response = await responsePromise;

    expect(response.status()).toBe(201);
  });

  test("User should see error message for existing email", async ({ signUpPage }) => {
    

    const user = signUpScenarios.existingUser;

    await signUpPage.createAccount(
      user.fullName,
      user.workEmail,
      user.companyName,
      user.password
    );

   await expect(
  signUpPage.errormessage.getErrorMessage(ErrorFields.SIGNIN_PASSWORD)
).toHaveText("A user with this email already exists.");
  });

  test("User should see validation message for invalid email", async ({ signUpPage }) => {
    

    const user = signUpScenarios.invalidEmail;

    await signUpPage.createAccount(
      user.fullName,
      user.workEmail,
      user.companyName,
      user.password
    );

    await expect(
    signUpPage.errormessage.getErrorMessage(
      ErrorFields.SIGNIN_EMAIL
    )
  ).toHaveText("Enter a valid work email address.");
  });

});