import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";
import { Dropdown } from "../enums/component-enum/dropdown.enum";
import { Buttons, MenuItems } from "../enums/component-enum/buttons.enums";
export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  getDropdownField = () => this.dropdown.getDropdown(Dropdown.CART_PRODUCT);
  getAddSelectedProductButton = () =>
    this.button.getButton(Buttons.ADD_SELECTED_PRODUCT);
  getDropdownOption = (itemName: string) =>
    this.page.getByTestId(`dropdown-option-${itemName}`);
  getViewButton = (productName: string) =>
    this.page.getByTestId(`button-view-${productName}`);
  getCartHeading = () => this.page.getByTestId("heading-cart");
  getDialogQty = (productName: string) =>
    this.page.getByTestId(`${productName}-quantity`);
  getIncrementQtyField = (productName: string) =>
    this.page.getByTestId(`button-increment-${productName}`);
  getDecrementQtyField = (productName: string) =>
    this.page.getByTestId(`button-decrement-${productName}`);

  getRemoveItemButton = (productName: string) =>
    this.page.getByTestId(`button-Remove-${productName}`);
  getRemoveConfirmationDialog = () =>
    this.page.getByTestId("button-Remove Item");

  getProductName = (itemName: string) =>
    this.page.getByTestId(`product-${itemName}`);

  getProductPrice = (productName: string) =>
    this.page.getByTestId(`price-${productName}`);
  getCartCount = () => this.page.getByTestId("summary-cart-items-count");
  getProductQuantity = (productName: string) =>
    this.page.getByTestId(`${productName}-quantity`);
  async clickOnCartIcon() {
    // await this.clickElement(this.getNavItem("Cart"));
    await this.button.getMenuItem(MenuItems.CART).click();
  }
  async AddItemToCart(item: string) {
    await this.dropdown.getDropdown(Dropdown.CART_PRODUCT).click();
    await this.getDropdownOption(item).click();
    // await this.selectCustomDropdownOption(this.getDropdownField(), item);
    await this.button.getButton(Buttons.ADD_SELECTED_PRODUCT).click();
    // await this.clickElement(this.getAddSelectedProductButton());
  }
  async IncreaseQty(item: string) {
    await this.clickElement(this.getIncrementQtyField(item));
  }
  async DecreaseQty(item: string) {
    await this.clickElement(this.getDecrementQtyField(item));
  }

  async removeItem(item: string) {
    await this.clickElement(this.getRemoveItemButton(item));
    await this.clickElement(this.getRemoveConfirmationDialog());
  }
}
