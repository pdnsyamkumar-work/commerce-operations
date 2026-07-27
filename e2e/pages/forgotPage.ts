import { Page, Locator } from "@playwright/test";
import { forgotPassword } from "../interfaces/userData";
import { BasePage } from "./basePage";
export class ForgotPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  getForgotEmailTextbox(): Locator {
    return this.page.getByTestId("input-field-forgot-password-work-email");
  }
  getForgotPage(): Locator {
    return this.page.getByTestId("link-forgot-password");
  }
  getResetBtn(): Locator {
    return this.page.getByTestId("button-Send-Reset-Link");
  }
  getEmailError(): Locator {
    return this.page.getByTestId("reset-email-error");
  }
  getResetHeading(): Locator {
    return this.page.getByTestId("heading-reset-password");
  }
  async gotoforgotPassword() {
    await this.clickElement(this.getForgotPage());
  }
  async forgotPassword(email: string) {
    await this.fillField(this.getForgotEmailTextbox(), email);
  }
  async clickresetBtn() {
    await this.clickElement(this.getResetBtn());
  }
  getPasswordResetSuccessMessage(email: string) {
    return this.page.locator("p").filter({
      hasText: `Password reset instructions were sent to ${email}.`,
    });
  }
}
