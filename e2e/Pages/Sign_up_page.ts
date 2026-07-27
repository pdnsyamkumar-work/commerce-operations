import { Page, Locator, expect } from "@playwright/test";
import sign_in from "./sign-in-page";
import { Signupdata } from "../utils/interfaces/signup.interface";
import { use } from "react";

export default class SignUp {
  constructor(private page: Page) {}

  //Locators
  sign_up = () => this.page.locator("//button[normalize-space()='Sign up']");
  fullName = () => this.page.getByLabel("Full name ");
  email = () => this.page.locator("//input[@inputmode='email']");
  companyName = () => this.page.getByText("Store or company name");
  password = () => this.page.locator("//input[@type='password']").nth(0);
  confirmPassword = () => this.page.locator("//input[@type='password']").nth(1);
  create_acnt_btn = () =>
    this.page.locator("//button[text()='Create Account']");
  profileDropdown = () => this.page.locator("header button").last();
  signOutBtn = () =>
    this.page.locator("//button[normalize-space()='Sign Out']");

  //Validation  locators
  first_name_error = () =>
    this.page.locator("//p[text()='Full name is required.']");
  email_error = () =>
    this.page.locator("//p[text()='Work email is required.']");
  companyName_error = () =>
    this.page.locator("//p[text()='Store or company name is required.']");
  pwd_error = () => this.page.locator("//p[text()='Password is required.']");
  confirm_pwd_error = () =>
    this.page.locator("//p[text()='Confirm password is required.']");
  userExistsError = () =>
    this.page.locator("//p[contains(text(),'already exists')]");

  // Navigate to Login Page.
  async navigate() {
    await this.page.goto("http://localhost:3000/");
  }

  //click on signuptab

  async clickSignUpTab() {
    await this.sign_up().click();
  }

  //signup using provided credentials.

  async fillSignupDetails(data: Signupdata) {
    await this.fullName().fill(data.full_name);
    await this.email().fill(data.work_email);
    await this.companyName().fill(data.companyName);
    await this.password().fill(data.password);
    await this.confirmPassword().fill(data.confirmPassword);
  }

  //After filling detals need to clik On create button
  async clickCreateAccount() {
    await this.create_acnt_btn().click();
  }

  //Logout from application.
  async logout() {
    await this.profileDropdown().click();
    await this.signOutBtn().click();
  }

  async getExpectedErrorLocator(data: Signupdata) {
    if (data.full_name.trim() === "") {
      return this.first_name_error();
    }

    if (data.work_email.trim() === "") {
      return this.email_error();
    }

    if (data.companyName.trim() === "") {
      return this.companyName_error();
    }

    if (data.password.trim() === "") {
      return this.pwd_error();
    }

    if (data.confirmPassword.trim() === "") {
      return this.confirm_pwd_error();
    }

    return null;
  }

  async multisignup(data: Signupdata[]) {
    for (const users of data) {
      await this.navigate();
      await this.clickSignUpTab();
      await this.fillSignupDetails(users);
      await this.clickCreateAccount();
      const errorLocator = await this.getExpectedErrorLocator(users);

      if (errorLocator) {
        await expect(errorLocator).toBeVisible();
        const errorText = await errorLocator.innerText();
        console.log(
          `Validation displayed for ${users.work_email}: ${errorText}`,
        );
        continue;
      } else if (await this.userExistsError().isVisible()) {
        await expect(this.userExistsError()).toBeVisible();
        console.log(`User already exists: ${users.work_email}`);
        continue;
      } else {
        await expect(this.profileDropdown()).toBeVisible();
        console.log(`Account created successfully: ${users.work_email}`);
        await this.logout();
      }
    }
  }
}

/*
async verifySignupValidation(users: SignupData[]) {
  for (const user of users) {
    await this.navigate();

    await this.clickSignUpTab();

    await this.Signup(user);

    await this.clickCreateAccount();

    const errorLocator =
      await this.getExpectedErrorLocator(user);

    if (errorLocator) {
      await expect(errorLocator).toBeVisible();

      console.log(
        `Validation displayed for: ${user.work_email}`
      );
    }
  }
}
*/
