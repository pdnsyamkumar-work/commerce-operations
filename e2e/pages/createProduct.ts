import { Page, Locator } from "@playwright/test";
import { ProductData } from "../interfaces/userData";
import { BasePage } from "./basePage";
export class createProduct extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  getProductPageLink(): Locator {
    return this.page.getByTestId(`nav-item-Products`);
  }
  getProductNameField(): Locator {
    return this.page.getByTestId("input-field-product-name");
  }
  getProductCodeField(): Locator {
    return this.page.getByTestId("input-field-product-code");
  }
  getCategoryField(): Locator {
    return this.page.getByTestId("input-field-product-category");
  }
  getPriceField(): Locator {
    return this.page.getByTestId("input-field-product-price");
  }
  getStockField(): Locator {
    return this.page.getByTestId("input-field-product-stock");
  }
  getStatusDropdown(): Locator {
    return this.page.getByTestId("dropdown-product-status");
  }
  getChooseFiles(): Locator {
    return this.page.getByTestId("button-choose-files");
  }
  getCreateProductBtn(): Locator {
    return this.page.getByTestId("button-create-product");
  }
  getProductHeading(): Locator {
    return this.page.getByTestId("heading-create-product");
  }
  getProductNameError(): Locator {
    return this.page.getByTestId("error-product-name");
  }
  getProductCodeError(): Locator {
    return this.page.getByTestId("error-product-code");
  }
  getCategoryError(): Locator {
    return this.page.getByTestId("error-product-category");
  }
  getPriceError(): Locator {
    return this.page.getByTestId("error-product-price");
  }
  getStockError(): Locator {
    return this.page.getByTestId("error-product-stock");
  }
  getProductStatusError(): Locator {
    return this.page.getByTestId("error-product-status");
  }
  getProductImagesError(): Locator {
    return this.page.getByTestId("error-product-files");
  }

  async navigateToProductsPage() {
    await this.clickElement(this.getProductPageLink());
    // await this.productsLink.click();
  }
  async fillCreateProductForm(data: ProductData) {
    await this.fillField(this.getProductNameField(), data.productName);
    await this.fillField(this.getProductCodeField(), data.productCode);
    await this.fillField(this.getCategoryField(), data.category);
    await this.fillField(this.getPriceField(), data.price);
    await this.fillField(this.getStockField(), data.stock);
    await this.selectDropdownOption(this.getStatusDropdown(), data.status);
    await this.setFiles(this.getChooseFiles(), data.images);
  }
  async clickOnCreateProduct() {
    await this.clickElement(this.getCreateProductBtn());
  }
}
