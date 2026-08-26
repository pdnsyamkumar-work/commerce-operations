import { Page } from "@playwright/test";

export class CartItemComponent {
  readonly page: Page;
  readonly productName: string;
   readonly productId: string;


  constructor(page: Page, productName: string,productId: string) {
    this.page = page;
    this.productName = productName;
    this.productId = productId;
  }

  private cartItem() {
    return this.page
      .getByRole("heading", {
        name: this.productName,
        exact: true,
      })
      .locator(
        "xpath=ancestor::div[contains(@class,'rounded-[1.4rem]')]"
      )
      .first();
  }

  increaseButton() {
    return this.page.getByTestId(`increase-btn-${this.productId}`);
  }

  decreaseButton() {
    return this.page.getByTestId(`decrease-btn-${this.productId}`);
  }

  viewButton() {
    return this.page.getByTestId(`view-btn-${this.productId}`);
  }

  removeButton() {
    return this.page.getByTestId(`remove-btn-${this.productId}`);
  }

  async increaseQuantity() {
    await this.increaseButton().click();
  }

  async decreaseQuantity() {
    await this.decreaseButton().click();
  }

  async viewProduct() {
    await this.viewButton().click();
  }

  async removeProduct() {
    await this.removeButton().click();
  }
}