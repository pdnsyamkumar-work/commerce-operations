import { Page, Locator } from '@playwright/test';
import { BasePage } from "./basepage";
import { Buttons } from "../enums/button.enums";
import { TextField } from "../enums/text-field.enums";

export class ForgotPasswordPage extends BasePage {

  // Navigation
  readonly forgotPasswordBtn: Locator;

  // Form
  readonly workEmailInput: Locator;
  readonly sendResetLinkBtn: Locator;

   constructor(page: BasePage["page"]) {
    super(page);

    this.forgotPasswordBtn = page.getByTestId("tab-forgot password");
    

    this.workEmailInput = this.field.getInputField(TextField.WORKEMAIL);

this.sendResetLinkBtn = this.button.getButton(Buttons.SEND_RESET_LINK);
  } 
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
    await this.fillField(this.workEmailInput,email);
  }

  async clickSendResetLink() {
    await this.clickElement(this.sendResetLinkBtn)
  }

  async forgotPassword(email: string) {
    await this.goToForgotPassword();
    await this.enterWorkEmail(email);
    await this.clickSendResetLink();
  }
   getSuccessMessage() {
  return this.page.getByRole('status');
}
}