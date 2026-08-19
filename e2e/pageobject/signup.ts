import { Page, Locator } from '@playwright/test';

export class SignupPage {
  readonly page: Page;

  // Tabs
  readonly signUpTab: Locator;

  // Form Fields
  readonly fullName: Locator;
  readonly workEmail: Locator;
  readonly companyName: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;

  // Buttons
  readonly passwordViewBtn: Locator;
  readonly confirmPasswordViewBtn: Locator;
  readonly createAccountBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // Tabs
    this.signUpTab = page.getByRole('button', { name: 'Sign up' });

    // Input Fields
    this.fullName = page.getByLabel('Full name');
    this.workEmail = page.getByLabel('Work email');
    this.companyName = page.getByLabel('Store or company name');
    this.password = page.locator('input[type="password"]').nth(0);
    this.confirmPassword = page.locator('input[type="password"]').nth(1);

    // View Buttons
    this.passwordViewBtn = page.getByRole('button', { name: 'View' }).nth(0);
    this.confirmPasswordViewBtn = page.getByRole('button', { name: 'View' }).nth(1);

    // Submit Button
    this.createAccountBtn = page.getByRole('button', {name: 'Create Account',});
  }
  async waitForSignupApi() {
  return await this.page.waitForResponse(
    (response) =>
      response.url().includes('/signup') &&
      response.request().method() === 'POST'
  );
}

async navigate(url: string) {
    await this.page.goto(url);
}

  async clickSignUp() {
    await this.signUpTab.click();
  }

  async enterFullName(name: string) {
    await this.fullName.fill(name);
  }

  async enterWorkEmail(email: string) {
    await this.workEmail.fill(email);
  }

  async enterCompanyName(company: string) {
    await this.companyName.fill(company);
  }

  async enterPassword(password: string) {
    await this.password.fill(password);
  }

  async enterConfirmPassword(confirmPassword: string) {
    await this.confirmPassword.fill(confirmPassword);
  }

  async clickCreateAccount() {
    await this.createAccountBtn.click();
  }

  async createAccount(
    name: string,
    email: string,
    company: string,
    password: string
  ) {
    await this.clickSignUp();
    await this.enterFullName(name);
    await this.enterWorkEmail(email);
    await this.enterCompanyName(company);
    await this.enterPassword(password);
    await this.enterConfirmPassword(password);
    await this.clickCreateAccount();
  }
}