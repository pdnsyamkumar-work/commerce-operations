import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Buttons } from "../enums/buttons";
import { Labels } from "../enums/labels";
import { dropdowns } from "../enums/dropdowns";

export class createProduct extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async waitForCreateProductApi() {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes("/products") &&
        response.request().method() === "POST",
    );
  }

  async navigateToProductPage() {
    await this.button.getButton(Buttons.PRODUCTS_NAV).click();
  }

  async enterProductDetails(
    productName: string,
    productCode: string,
    category: string,
    price: string,
    stock: string,
    status: string,
    images: string[],
  ) {
    await this.textField.getInputField(Labels.PRODUCT_NAME).fill(productName);
    await this.textField.getInputField(Labels.PRODUCT_CODE).fill(productCode);
    await this.textField.getInputField(Labels.CATEGORY).fill(category);
    await this.textField.getInputField(Labels.PRICE).fill(price);
    await this.textField.getInputField(Labels.STOCK).fill(stock);
    await this.dropdown.getDropdown(dropdowns.STATUS_DROPDOWN).selectOption(status);
    await this.dropdown.getDropdown(dropdowns.UPLOAD_FILES).setInputFiles(images);
  }
  async clickOnCreateProductButton() {
    await this.button.getButton(Buttons.CREATE_PRODUCT).click();
  }

  verifyProductAdded(productCode:string){
    return this.page.locator("tbody tr").filter({
      hasText:productCode,
    });
  }
}
