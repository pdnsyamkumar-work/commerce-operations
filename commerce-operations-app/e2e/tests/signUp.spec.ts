import { expect } from "@playwright/test";
import { SignUpdata } from "./test-data/signUPScenarios";
import { ErrorFields } from "../enums/inLineErrors";
import{test}from "../Fixtures/fixtures";

test.describe("Signup tests", () => {

  test("User should successfully create account", async ({signinPage, signUpPage}) => {
    const user = SignUpdata.success;
    await signUpPage.signUpClick();
    await signUpPage.fillTheForm(
      user.fullName,
      user.workEmail,
      user.companyName,
      user.password,
      user.confirmPassword,
    );
    const responsePromise = signUpPage.waitForsignUpAPI();
    await signUpPage.clickOnCreateAccount();
    const response = await responsePromise;
    expect(response.status()).toBe(201);
    await expect(signUpPage.getCommerceTitle()).toBeVisible();
  });

  test("User should not be able to sign up with existing email", async ({signinPage,signUpPage}) => {
    const user = SignUpdata.existingUser;
    await signUpPage.signUpClick();
    await signUpPage.fillTheForm(
      user.fullName,
      user.workEmail,
      user.companyName,
      user.password,
      user.confirmPassword,
    );
    await signUpPage.clickOnCreateAccount();
    await expect(signUpPage.getCommerceTitle()).not.toBeVisible();
  });

  test("User should not be able to sign up when passwords do not match", async ({signinPage,signUpPage}) => {
    const user = SignUpdata.passwordMismatch;
    await signUpPage.signUpClick();
    await signUpPage.fillTheForm(user.fullName,user.workEmail,user.companyName,user.password,user.confirmPassword,);
    await signUpPage.clickOnCreateAccount();
    await expect(signUpPage.getCommerceTitle()).not.toBeVisible();
  });

  test("User should not able to signup without full name",async({signinPage,signUpPage})=>{
    const user = SignUpdata.fillWithoutFullName;
    await signUpPage.signUpClick();
    await signUpPage.fillTheForm(user.fullName,user.workEmail,user.companyName,user.password,user.confirmPassword,);
    await signUpPage.clickOnCreateAccount();
    await expect(signUpPage.errorField.getErrorMessage(ErrorFields.SIGNUP_FULLNAME)).toBeVisible();
    await expect(signUpPage.getCommerceTitle()).not.toBeVisible();
  });

  test("User should not able to signup without work email",async({signinPage,signUpPage})=>{
    const user = SignUpdata.fillWithoutWrkEmail;
    await signUpPage.signUpClick();
    await signUpPage.fillTheForm(user.fullName,user.workEmail,user.companyName,user.password,user.confirmPassword,);
    await signUpPage.clickOnCreateAccount();
    await expect(signUpPage.errorField.getErrorMessage(ErrorFields.SIGNUP_WORK_EMAIL)).toBeVisible();
    await expect(signUpPage.getCommerceTitle()).not.toBeVisible();
  });

  test("User should not able to signup without company name",async({signinPage,signUpPage})=>{
    const user = SignUpdata.fillWithoutCompanyName;
    await signUpPage.signUpClick();
    await signUpPage.fillTheForm(user.fullName,user.workEmail,user.companyName,user.password,user.confirmPassword,);
    await signUpPage.clickOnCreateAccount();
    await expect(signUpPage.errorField.getErrorMessage(ErrorFields.SIGNUP_COMPANY_NAME)).toBeVisible();
    await expect(signUpPage.getCommerceTitle()).not.toBeVisible();
  });

  test("User should not able to signup without password",async({signinPage,signUpPage})=>{
    const user = SignUpdata.fillWithoutPassword;
    await signUpPage.signUpClick();
    await signUpPage.fillTheForm(user.fullName,user.workEmail,user.companyName,user.password,user.confirmPassword,);
    await signUpPage.clickOnCreateAccount();
    await expect(signUpPage.errorField.getErrorMessage(ErrorFields.SIGNUP_PASSWORD)).toBeVisible();
    await expect(signUpPage.getCommerceTitle()).not.toBeVisible();
  });

  test("User should not able to signup without confirm password",async({signinPage,signUpPage})=>{
    const user = SignUpdata.fillWithoutConfirmPassword;
    await signUpPage.signUpClick();
    await signUpPage.fillTheForm(user.fullName,user.workEmail,user.companyName,user.password,user.confirmPassword,);
    await signUpPage.clickOnCreateAccount();
    await expect(signUpPage.errorField.getErrorMessage(ErrorFields.SIGNUP_CONFIRM_PASSWORD)).toBeVisible();
    await expect(signUpPage.getCommerceTitle()).not.toBeVisible();
  });
});
