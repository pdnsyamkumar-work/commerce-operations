import { Page, expect } from "@playwright/test";
import { ForgotPwdData } from "../utils/interfaces/forgotpwd.interface";

export default class Forgot_Pwd {
  constructor(private page: Page) {}

  // Locators
  forgotPwd = () => this.page.getByRole("button", { name: "Forgot password" });

  email = () => this.page.locator("//input[@inputmode='email']");

  resetBtn = () => this.page.getByRole("button", { name: "Send Reset Link" });

  email_error = () => this.page.getByText("Work email is required.");

  // mail_error = () =>
  //   this.page.getByText("Enter a valid work email address.");

  // mail_error = () =>
  //   this.page.locator("#reset-email");

  notification = () => this.page.getByRole("status");

  async navigate() {
    await this.page.goto("http://localhost:3000/");
  }

  async clickForgotPwd() {
    await this.forgotPwd().click();
  }

  async enterEmail(email: string) {
    await this.email().fill(email);
  }

  async clickResetBtn() {
    await this.resetBtn().click();
  }

  async forgotPassword(data: ForgotPwdData[]) {
    for (const user of data) {
      await this.navigate();

      await this.clickForgotPwd();

      await this.enterEmail(user.email);

      await this.clickResetBtn();

      if (user.email.trim() === "") {
        await expect(this.email_error()).toBeVisible();
      } else {
        await expect(this.notification()).toContainText(
          `Password reset instructions were sent to ${user.email}`,
        );
      }
    }
  }
}
