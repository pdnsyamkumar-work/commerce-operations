import { Page, Locator } from "@playwright/test";

export class BasePage {
  page: Page;
  signinBtn: Locator;

  // FEEDBACK: Component classes should be initilized here and should be used from Child feature page classes
  constructor(page: Page) {
    this.page = page;

    this.signinBtn = page.locator("//button[text()='Sign In']");
  }

  async clickSigninButton() {
    await this.signinBtn.click();
  }
}
