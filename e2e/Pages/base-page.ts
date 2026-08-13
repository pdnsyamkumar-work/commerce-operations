import { Page, Locator } from "@playwright/test";

export class BasePage {
  page: Page;
  signinBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signinBtn = page.locator("//button[text()='Sign In']");
  }

  async clickSigninButton() {
    await this.signinBtn.click();
  }
}
