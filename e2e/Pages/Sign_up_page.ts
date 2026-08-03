import { Page, expect } from "@playwright/test";

import { Signupdata } from "../utils/interfaces/signup.interface";
import { BasePage } from "../Base/Base-page";
import { Buttons, ErrorField } from "../enums/component_enums/labes_enums";
import { TextFiled } from "../enums/component_enums/labes_enums";

export default class SignUp extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  //click on signuptab

  async clickSignUpTab() {
    await this.button.getButton(Buttons.SIGN_UP).click();
  }

  //signup using provided credentials.

  async fillSignupDetails(data: Signupdata) {
    await this.textfield
      .getInputFiled(TextFiled.FULL_NAME)
      .fill(data.full_name);
    await this.textfield
      .getInputFiled(TextFiled.WORK_EMAIL)
      .fill(data.work_email);
    await this.textfield
      .getInputFiled(TextFiled.COMPANY_NAME)
      .fill(data.companyName);
    await this.textfield
      .getInputFiled(TextFiled.SIGN_UP_PASSWORD)
      .fill(data.password);
    await this.textfield
      .getInputFiled(TextFiled.CONFIRM_PASSWORD)
      .fill(data.confirmPassword);
  }

  //After filling detals need to clik On create button
  async clickCreateAccount() {
    await this.button.getButton(Buttons.CREATE_ACCOUNT).click();
  }

  async getExpectedErrorLocator(data: Signupdata) {
    if (data.full_name.trim() === "") {
      return this.errormessage.getErrorMessage(ErrorField.FULL_NAME);
    }

    if (data.work_email.trim() === "") {
      return this.errormessage.getErrorMessage(ErrorField.EMAIL_ADDRESS);
    }

    if (data.companyName.trim() === "") {
      return this.errormessage.getErrorMessage(ErrorField.COMPANY_NAME);
    }

    if (data.password.trim() === "") {
      return this.errormessage.getErrorMessage(ErrorField.PASSWORD);
    }

    if (data.confirmPassword.trim() === "") {
      return this.errormessage.getErrorMessage(ErrorField.CONFIRM_PASSWORD);
    }

    return null;
  }

  async multisignup(data: Signupdata[]) {
    for (const user of data) {
      await this.navigate();
      await this.clickSignUpTab();
      await this.fillSignupDetails(user);
      await this.clickCreateAccount();

      const errorLocator = await this.getExpectedErrorLocator(user);

      if (errorLocator) {
        console.log(`Validation displayed for ${user.work_email}`);
        continue;
      }
      const userExistsLocator = this.page.getByText("User already exists.");
      if (await userExistsLocator.isVisible()) {
        console.log(`User already exists: ${user.work_email}`);
        continue;
      }
      const profileDropdown = this.button.getButton(Buttons.PROFILE_DROPDOWN);

      if (await profileDropdown.isVisible()) {
        console.log(`Account created successfully: ${user.work_email}`);
        await this.logout();
      }
    }
  }
}
