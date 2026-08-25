import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Buttons } from "../enums/buttons";
import { Labels } from "../enums/labels";

export class forgetPassword extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
 
  readonly getSuccessMsg = () =>
    this.page.getByText(
      "Password reset instructions were sent to admin@commerce.test.",
    ).first();
  async enterEmail(email: string): Promise<void> {
    await this.textField.getInputField(Labels.FORGET_PASSWORD_EMAIL).fill(email);
  }
  async clickOnForgetPassword() {
    await this.button.getButton(Buttons.FORGET_PASSWORD_NAV).click();
  }
  async clickOnSendResetLink() {
    await this.button.getButton(Buttons.RESENT_LINK).click();
  }
}
