import { Page, expect } from "@playwright/test";

import { SignupData } from "../utils/interfaces/signup.interface";
import { BasePage } from "../Base/Base-page";
import { ErrorField } from "../enums/component_enums/Error_enums";
import { Buttons} from "../enums/component_enums/Buttons_enum";
import { TextFiled } from "../enums/component_enums/text_field_enums";

export default class SignUp extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  //click on signuptab

  async clickSignUpTab() {
    await this.button.getButton(Buttons.SIGN_UP).click();
  }

  //signup using provided credentials.

  async fillSignupDetails(data: SignupData) {
    await this.textfield
      .getInputFiled(TextFiled.FULL_NAME)
      .fill(data.fullName);
    await this.textfield
      .getInputFiled(TextFiled.WORK_EMAIL)
      .fill(data.workEmail);
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

  async getExpectedErrorLocator(data: SignupData) {
    if (data.fullName.trim() === "") {
      return this.errormessage.getErrorMessage(ErrorField.FULL_NAME);
    }

    if (data.workEmail.trim() === "") {
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

  async multisignup(data: SignupData[]) {
    for (const user of data) {
      await this.navigate();
      await this.clickSignUpTab();
      await this.fillSignupDetails(user);
      await this.clickCreateAccount();

      const errorLocator = await this.getExpectedErrorLocator(user);

      if (errorLocator) {
        console.log(`Validation displayed for ${user.workEmail}`);
        continue;
      }
      const userExistsLocator = this.page.getByText("User already exists.");
      if (await userExistsLocator.isVisible()) {
        console.log(`User already exists: ${user.workEmail}`);
        continue;
      }
      const profileDropdown = this.button.getButton(Buttons.PROFILE_DROPDOWN);

      if (await profileDropdown.isVisible()) {
        console.log(`Account created successfully: ${user.workEmail}`);
      }
    }
  }
}
