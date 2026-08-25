import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Buttons } from "../enums/buttons";
import { dropdowns } from "../enums/dropdowns";

export class cartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToCartPage() {
    await this.button.getButton(Buttons.CART_NAV).click();
  }
  getProductOption(productName: string) {
    return this.page.locator("button").filter({
      has: this.page.locator("span.font-semibold", { hasText: productName }),
    });
  }
  async openProductsDropdown() {
    await this.dropdown.getDropdown(dropdowns.PRODUCTS_DROPDOWN).click();
  }
  async selectProduct(productName: string) {
    await this.dropdown.getDropdown(dropdowns.PRODUCTS_DROPDOWN_LIST).click();
  }
  async increaseProductQuantity(productName: string) {
    await this.button.getProductButton(Buttons.PRODUCT_INCREMENT,productName).click();
  }
  async decreaseProductQuantity(productName: string) {
    await this.button.getProductButton(Buttons.PRODUCT_DECREMENT,productName).click();
  }
  async clickOnViewProductDetails(item: string) {
    await this.button.getProductButton(Buttons.PRODUCT_VIEW, item).click();
  }
  async clickOnCloseCartItemDialog() {
    await this.button.getButton(Buttons.CANCEL_CLOSE_CART_ITEM_DIALOG).click();
  }
  async clickOnDeleteTheProduct(item: string) {
    await this.button.getProductButton(Buttons.PRODUCT_REMOVE, item).click();
  }
  async clickOnAddProductButton() {
    await this.button.getButton(Buttons.ADD_SELECTED_PRODUCT).click();
  }
  async clickOnRemoveConfirmButton() {
    await this.button.getButton(Buttons.REMOVE_ITEM).click();
  }
  async clickOnCloseButton() {
    await this.button.getButton(Buttons.CANCEL_REMOVE_ITEM).click();
  }
}
