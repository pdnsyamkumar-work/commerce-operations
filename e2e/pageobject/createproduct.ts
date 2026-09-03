import { BasePage } from "./basepage";
import { Buttons } from "../enums/button.enums";
import { TextField } from "../enums/text-field.enums";
import { FileUpload } from "../enums/fileupload.enums";

export class CreateProductPage extends BasePage {

  // Products
  readonly productsTab =
    this.page.getByTestId("products-nav");

<<<<<<< Updated upstream
  // FEEDBACK: Constructor is not required since we are inheriting all from base page class
  constructor(page: Page) {
    super(page);
=======
  readonly createProductHeading =
    this.page.getByTestId("text-create product");
>>>>>>> Stashed changes

  // Create Product form
  readonly productName =
    this.field.getInputField(TextField.PRODUCT_NAME);

  readonly productCode =
    this.field.getInputField(TextField.PRODUCT_CODE);

  readonly category =
    this.field.getInputField(TextField.CATEGORY);

  readonly price =
    this.field.getInputField(TextField.PRICE);

  readonly stock =
    this.field.getInputField(TextField.STOCK);

  readonly status =
    this.page.getByTestId("dropdown-product status");

  readonly productImages =
    this.uploadfile.getUpload(FileUpload.PRODUCT_IMAGE);

  // Button
  readonly createProductButton =
    this.button.getButton(Buttons.CREATE_PRODUCT);

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