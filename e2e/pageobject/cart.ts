import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./basepage";
import { Buttons } from "../enums/button.enums";
import { Dropdown } from "../enums/dropdown.enums";

export class CartPage extends BasePage {

  // FEEDBACK: Constructor is not required since we are inheriting all from base page class
  readonly cartTab: Locator;
  readonly productDropdown: Locator;
  readonly addSelectedProductBtn: Locator;
  readonly viewBtn: Locator;
  readonly xButton: Locator;
  readonly removeBtn: Locator;

  constructor(page: Page) {
    super(page);

    // Cart
    this.cartTab = page.getByTestId("cart-nav");

    // Product Dropdown
    this.productDropdown =
      this.dropdown.getSelectDropdown(Dropdown.PRODUCT_CARTS);

    // Buttons
    this.addSelectedProductBtn =
      this.button.getButton(Buttons.ADD_SELECTED_PRODUCT);

    this.viewBtn =
      this.button.getButton(Buttons.VIEW_CARTED_PRODUCT).first();

    // X button inside View modal
    this.xButton = page.getByRole("button", {
      name: "Close cart item details",
    });

    // Remove button
    this.removeBtn =
      this.button.getButton(Buttons.REMOVE_CARTED_PRODUCT).first();
  }

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