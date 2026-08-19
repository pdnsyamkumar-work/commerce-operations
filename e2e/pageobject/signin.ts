import { Page, Locator, expect } from "@playwright/test";

export class SignInPage {
  readonly page: Page;
  readonly emailAddress: Locator;
  readonly password: Locator;
  readonly signInBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailAddress = page.getByLabel("Email address");
    this.password = page.locator('input[type="password"]');
    this.signInBtn = page.locator('button[type="submit"]');
  }
  async waitForLoginApi() {
  return await this.page.waitForResponse(
    (response) =>
      response.url().includes('/login') &&
      response.request().method() === 'POST'
  );
}

  async navigate(url: string) {
    await this.page.goto(url);
  }

  async enterEmail(email: string) {
    await this.emailAddress.fill(email);
  }

  async enterPassword(password: string) {
    await this.password.fill(password);
  }

  async clickOnSignIn() {
    await this.signInBtn.click();
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