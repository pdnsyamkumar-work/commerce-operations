import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class cartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  readonly getCart = () => this.page.getByTitle("Cart");
  readonly getProductsDropDown = () =>
    this.page.getByTestId("products-dropdown");
  readonly getAddSelectedProductButton = () =>
    this.page.getByTestId("add-selected-product-button");
  readonly getRemoveButton = (itemName: string) =>
    this.page.getByTestId(`product-remove-${itemName}`);
  readonly getViewButton = (itemName: string) =>
    this.page.getByTestId(`product-view-button-${itemName}`);
  readonly getRemoveButtonConfirm = () =>
    this.page.getByTestId("remove-button-confirm");
  readonly getProductIncrementOperator = (itemName: string) =>
    this.page.getByTestId(`productQunatity-increase-button-${itemName}`);
  readonly getProductDecrementOperator = (itemName: string) =>
    this.page.getByTestId(`productQunatity-decrease-button-${itemName}`);
  readonly getEmptyCartMessage = () =>
    this.page.locator(
      "//span[text()='Cart is empty. Add a product to begin checkout preparation.']",
    );
  readonly getAllTheAddedroducts = () =>
    this.page.locator("//div[@class='mt-5 grid gap-3']//div//h3");
  readonly getCartTitle = () => this.page.getByTestId("cart-item-title");
  readonly getCloseButtonInPopUp = () => this.page.getByTestId("close-button");

  async navigateToCartPage() {
    await this.getCart().click();
  }
  getProductOption(productName: string) {
    return this.page.locator("button").filter({
      has: this.page.locator("span.font-semibold", { hasText: productName }),
    });
  }
  async openProductsDropdown() {
    await this.getProductsDropDown().click();
  }
  async selectProduct(productName: string) {
    await this.getProductOption(productName).click();
  }
  async increaseProductQuantity(productName: string) {
    await this.getProductIncrementOperator(productName).click();
  }
  async decreaseProductQuantity(productName: string) {
    await this.getProductDecrementOperator(productName).click();
  }
  async clickOnViewProductDetails(item: string) {
    await this.getViewButton(item).click();
  }
  async clickOnDeleteTheProduct(item: string) {
    await this.getRemoveButton(item).click();
  }
  async clickOnAddProductButton() {
    await this.getAddSelectedProductButton().click();
  }
  async alltheAddedProducts() {
    await this.getAllTheAddedroducts().allTextContents();
  }
  async clickOnRemoveConfirmButton() {
    await this.getRemoveButtonConfirm().click();
  }
  async clickOnCloseButton() {
    await this.getCloseButtonInPopUp().click();
  }
}
