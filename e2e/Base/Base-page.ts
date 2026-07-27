//This is the Parent class

import { Locator, Page } from "@playwright/test";

export class BasePage {
  protected page: Page;
  protected readonly baseUrl = "http://localhost:3000/";

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInBtn: Locator;
  readonly signUpBtn: Locator;
  readonly signOutBtn: Locator;
  readonly ProfileDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole("textbox", { name: "email" });
    this.passwordInput = page.getByLabel("Password *");
    this.signInBtn = page.locator("//button[text()='Sign In']");
    this.signUpBtn = page.getByRole("button", { name: "Sign up" });
    this.signOutBtn = this.page.locator(
      "//button[normalize-space()='Sign Out']",
    );
    this.ProfileDropdown = this.page.locator("header button").last();
  }

  async navigate() {
    await this.page.goto(this.baseUrl);
  }

  async clickOnSignIn() {
    await this.signInBtn.click();
  }

  async signUpClick() {
    await this.signUpBtn.click();
  }

  async logout() {
    await this.ProfileDropdown.click();
    await this.signOutBtn.click();
  }
}
