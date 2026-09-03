import { BasePage } from "./basepage";
import { Buttons } from "../enums/button.enums";
import { TextField } from "../enums/text-field.enums";

export class SignInPage extends BasePage {
  readonly emailAddress = this.field.getInputField(TextField.EMAIL);
  readonly password = this.field.getInputField(TextField.PASSWORD);
  readonly signInBtn = this.button.getButton(Buttons.SIGN_IN);

  async waitForLoginApi() {
    return await this.waitForResponse("/api/auth/login");
  }

  async navigate(url: string) {
    await this.goto(url);
  }

  async enterEmail(email: string) {
    await this.fillField(this.emailAddress, email);
  }

  async enterPassword(password: string) {
    await this.fillField(this.password, password);
  }

  async clickOnSignIn() {
    await this.clickElement(this.signInBtn);
  }

  async login(email: string, password: string) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickOnSignIn();
  }

  async getEmailValidationMessage() {
    return await this.emailAddress.evaluate(
      (element: HTMLInputElement) => element.validationMessage
    );
  }
}