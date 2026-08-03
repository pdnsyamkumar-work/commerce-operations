import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class forgetPassword extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  readonly getForgetPassbutton = () =>
    this.page.getByRole("button", { name: "Forgot password" });
  readonly getWorkEmail = () => this.page.getByTestId("input-field-email");
  readonly getSendResetLink = () =>
    this.page.getByTestId("button-send-reset-link");
  readonly getSuccessMsg = () =>
    this.page.getByText(
      "Password reset instructions were sent to admin@commerce.test.",
    ).first();
  readonly getErrorMsg = () => this.page.getByText("Work email is required.");

  async clickOnForgetPassword() {
    await this.getForgetPassbutton().click();
  }
  async clickOnSendResetLink() {
    await this.getSendResetLink().click();
  }
}
