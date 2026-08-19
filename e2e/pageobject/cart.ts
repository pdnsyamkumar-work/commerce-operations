import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  readonly cartTab: Locator;
  readonly productDropdown: Locator;
  readonly addSelectedProductBtn: Locator;
  readonly viewBtn: Locator;
  readonly xButton: Locator;
  readonly removeBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartTab = page.getByTitle('Cart');

    this.productDropdown = page.locator('button[aria-expanded]').first();

    this.addSelectedProductBtn = page.getByRole('button', {
      name: 'Add Selected Product',
    });

    this.viewBtn = page.getByRole('button', { name: 'View' }).first();

    // X button inside View modal
    this.xButton = page.getByRole('button', {
      name: 'Close cart item details',
    });

    // Remove button - choose the first one
    this.removeBtn = page.getByRole('button', {
      name: 'Remove',
      exact: true,
    }).first();
  }


  async openCart() {
    await this.cartTab.click();
    await this.productDropdown.scrollIntoViewIfNeeded();
  }

  async selectProduct(product: string) {
    await this.productDropdown.click();

    await this.page
      .getByRole('button', { name: new RegExp(product, 'i') })
      .click();
  }

  

  async clickAddSelectedProduct() {
    await this.addSelectedProductBtn.click();
  }
   async waitForAddToCartApi() {
    return await this.page.waitForResponse(
      (response) =>
        response.url().includes('/api/cart-items') &&
        response.request().method() === 'POST'
    );
  }

  async clickView() {
    await this.viewBtn.click();
  }

  // NEW: close View modal using X
  async clickXButton() {
    await this.xButton.click();
  }

  async clickRemove() {
    await this.removeBtn.click();
  }

  async verifyCartPage() {
    await expect(this.page).toHaveURL(/cart/);
  }
}