import { Page, Locator } from "@playwright/test";

export class HeaderComponent {
  readonly page: Page;
  readonly signinBtn: Locator;
  readonly cartBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signinBtn = page.getByRole("button", { name: "Sign In" });
    this.cartBtn = page.getByRole("button", { name: "Cart" });
  }

  async clickSigninButton() {
    await this.signinBtn.click();
  }

  async openCart() {
    await this.cartBtn.click();
  }
}