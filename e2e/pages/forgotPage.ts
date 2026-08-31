import { Page, Locator } from "@playwright/test";
import { forgotPassword } from "../interfaces/userData";
import { BasePage } from "./basePage";
import { Buttons } from "../enums/component-enum/buttons.enums";
import { TextField } from "../enums/component-enum/text-field.enum";
export class ForgotPage extends BasePage {
    // FEEDBACK: Constructor is not required since this feature class inherited from base page class

  constructor(page: Page) {
    super(page);
  }
  getForgotEmailTextbox(): Locator {
    return this.field.getInputField(TextField.WORKEMAIL);
  }
  getForgotPage(): Locator {
    return this.button.getButton(Buttons.FORGOT_LINK);
  }
  getResetBtn(): Locator {
    return this.button.getButton(Buttons.RESET_BUTTON);
  }
  getEmailError(): Locator {
    return this.page.getByTestId("inline-error");
  }
  getResetHeading(): Locator {
    return this.page.getByTestId("heading-reset-password");
  }
  async gotoforgotPassword() {
    await this.button.getButton(Buttons.FORGOT_LINK).click();
    // await this.clickElement(this.getForgotPage());
  }
  async forgotPassword(data: forgotPassword) {
    await this.field.getInputField(TextField.WORKEMAIL).fill(data.email);
    // await this.fillField(this.getForgotEmailTextbox(), email);
  }
  async clickresetBtn() {
    await this.button.getButton(Buttons.RESET_BUTTON).click();
    // await this.clickElement(this.getResetBtn());
  }
  getPasswordResetSuccessMessage(email: string) {
    return this.page.locator("p").filter({
      hasText: `Password reset instructions were sent to ${email}.`,
    });
  }
}
