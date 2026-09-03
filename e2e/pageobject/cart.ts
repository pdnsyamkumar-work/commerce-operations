import { expect } from "@playwright/test";
import { BasePage } from "./basepage";
import { Buttons } from "../enums/button.enums";
import { Dropdown } from "../enums/dropdown.enums";

export class CartPage extends BasePage {
  // Cart
  readonly cartTab = this.page.getByTestId("cart-nav");

  // Product Dropdown
  readonly productDropdown = this.dropdown.getSelectDropdown(
    Dropdown.PRODUCT_CARTS
  );

  // Buttons
  readonly addSelectedProductBtn = this.button.getButton(
    Buttons.ADD_SELECTED_PRODUCT
  );

  readonly viewBtn = this.button
    .getButton(Buttons.VIEW_CARTED_PRODUCT)
    .first();

  // X button inside View modal
  readonly xButton = this.page.getByRole("button", {
    name: "Close cart item details",
  });

  // Remove button
  readonly removeBtn = this.button
    .getButton(Buttons.REMOVE_CARTED_PRODUCT)
    .first();

  async openCart() {
    await this.clickElement(this.cartTab);
    await this.scrollIntoView(this.productDropdown);
  }

  async selectProduct(product: string) {
    await this.productDropdown.click();

    await this.page
      .getByRole("button", { name: new RegExp(product, "i") })
      .click();
  }

  async clickAddSelectedProduct() {
    await this.clickElement(this.addSelectedProductBtn);
  }

  async waitForAddToCartApi() {
    return await this.waitForResponse("/api/cart-items");
  }

  async clickView() {
    await this.clickElement(this.viewBtn);
  }

  async clickXButton() {
    await this.clickElement(this.xButton);
  }

  async clickRemove() {
    await this.clickElement(this.removeBtn);
  }

  async verifyCartPage() {
    await expect(this.page).toHaveURL(/cart/);
  }
}