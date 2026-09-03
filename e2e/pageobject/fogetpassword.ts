import { BasePage } from "./basepage";
import { Buttons } from "../enums/button.enums";
import { TextField } from "../enums/text-field.enums";

export class ForgotPasswordPage extends BasePage {
  // Navigation
  readonly forgotPasswordBtn = this.page.getByTestId("tab-forgot password");

  // Form
  readonly workEmailInput = this.field.getInputField(TextField.WORKEMAIL);
  readonly sendResetLinkBtn = this.button.getButton(Buttons.SEND_RESET_LINK);

  async waitForForgotPasswordApi() {
    return await this.waitForResponse("/forgot-password");
  }

  async navigate(url: string) {
    await this.page.goto(url);
  }

  async goToForgotPassword() {
    await this.clickElement(this.forgotPasswordBtn);
  }

  async enterWorkEmail(email: string) {
    await this.fillField(this.workEmailInput, email);
  }

  async clickSendResetLink() {
    await this.clickElement(this.sendResetLinkBtn);
  }

  async forgotPassword(email: string) {
    await this.goToForgotPassword();
    await this.enterWorkEmail(email);
    await this.clickSendResetLink();
  }

  getSuccessMessage() {
    return this.page.getByRole("status");
  }
}