import { Page, Locator } from '@playwright/test';
import { BasePage } from "./basepage";
import { Buttons } from "../enums/button.enums";
import { TextField } from "../enums/text-field.enums";
import { FileUpload } from "../enums/fileupload.enums";


export class CreateProductPage extends BasePage {

  readonly productsTab: Locator;
  readonly createProductHeading: Locator;
  readonly productName: Locator;
  readonly productCode: Locator;
  readonly category: Locator;
  readonly price: Locator;
  readonly stock: Locator;
  readonly status: Locator;
  readonly productImages: Locator;
  readonly createProductButton: Locator;

  // FEEDBACK: Constructor is not required since we are inheriting all from base page class
  constructor(page: Page) {
    super(page);

    // Products
    this.productsTab = page.getByTestId("products-nav");

    // Create Product form
    this.createProductHeading = page.getByTestId("text-create product");

    this.productName = this.field.getInputField(TextField.PRODUCT_NAME);
this.productCode = this.field.getInputField(TextField.PRODUCT_CODE);
this.category = this.field.getInputField(TextField.CATEGORY);
this.price = this.field.getInputField(TextField.PRICE);
this.stock = this.field.getInputField(TextField.STOCK);

    this.status = page.getByTestId("dropdown-product status");

    this.productImages =
  this.uploadfile.getUpload(FileUpload.PRODUCT_IMAGE);

    // Button
    this.createProductButton =
  this.button.getButton(Buttons.CREATE_PRODUCT);
  }

  async navigate(url: string) {
    await this.goto(url);
  }

  async goToProducts() {
    await this.clickElement(this.productsTab);
  }

  async waitForCreateProductApi() {
    return await this.waitForResponse("/api/products");
  }

  async createProduct(
    productName: string,
    productCode: string,
    category: string,
    price: string,
    stock: string,
    status: string,
    imagePath: string[],
    clickCreate: boolean = true
  ) {
    await this.fillField(this.productName, productName);
    await this.fillField(this.productCode, productCode);
    await this.fillField(this.category, category);
    await this.fillField(this.price, price);
    await this.fillField(this.stock, stock);

    await this.status.selectOption("Active");

    if (imagePath.length > 0) {
      await this.productImages.setInputFiles(imagePath);
    }

    if (clickCreate) {
      await this.clickElement(this.createProductButton);
    }
  }
}