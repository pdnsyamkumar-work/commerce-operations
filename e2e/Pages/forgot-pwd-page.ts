import { Page, Locator } from "@playwright/test";
import { ForgotPwdData } from "../utils/interfaces/forgot-pwd.interface";

export class ForgotPasswordPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel("Work email");
    this.submitButton = page.getByRole("button", { name: "Send Reset Link" });
  }

  async goto() {
    await this.page.goto("http://localhost:3000");
  }

  async navigateToForgotPassword() {
    await this.page.getByRole("button", { name: "Forgot password" }).click();
  }

  async resetPassword(email: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
