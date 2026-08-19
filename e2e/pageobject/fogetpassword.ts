import { Page, Locator } from '@playwright/test';

export class ForgotPasswordPage {
  readonly page: Page;

  // Navigation
  readonly forgotPasswordBtn: Locator;

  // Form
  readonly workEmailInput: Locator;
  readonly sendResetLinkBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.forgotPasswordBtn = page.getByRole('button', {
      name: 'Forgot password',
    });

    this.workEmailInput = page.getByLabel('Work email');

    this.sendResetLinkBtn = page.getByRole('button', {name: 'Send Reset Link',});
  }
  async waitForForgotPasswordApi() {
  return await this.page.waitForResponse(
    (response) =>
      response.url().includes('/forgot-password') &&
      response.request().method() === 'POST'
  );
}

  async navigate(url: string) {
    await this.page.goto(url);
}

  async goToForgotPassword() {
    await this.forgotPasswordBtn.click();
  }

  async enterWorkEmail(email: string) {
    await this.workEmailInput.fill(email);
  }

  async clickSendResetLink() {
    await this.sendResetLinkBtn.click();
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