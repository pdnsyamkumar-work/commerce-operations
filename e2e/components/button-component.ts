import { Page, Locator } from "@playwright/test";

export class HeaderComponent {
  readonly page: Page;
  readonly signinBtn: Locator;
  readonly cartBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // FEEDBACK: Why Button component is used under Header? 
    this.signinBtn = page.getByRole("button", { name: "Sign In" });
    this.cartBtn = page.getByRole("button", { name: "Cart" });
  }

  // FEEDBACK: this should be kept inside Sign In page Class, also the same method duplicated in Base Page
  async clickSigninButton() {
    await this.signinBtn.click();
  }

  // FEEDBACK: this should be kept inside Cart page Class
  async openCart() {
    await this.cartBtn.click();
  }
}