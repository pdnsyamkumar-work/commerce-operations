import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class createProduct extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  readonly getProductsTab = () => this.page.getByText("Products");
  readonly getProductName = () =>
    this.page.getByPlaceholder("Example: Canvas Weekender Bag");
  readonly getProductCode = () =>
    this.page.getByPlaceholder("Example: PRD-111");
  readonly getCategory = () => this.page.getByPlaceholder("Example: Travel");
  readonly getPrice = () => this.page.getByPlaceholder("Example: 84");
  readonly getStock = () => this.page.getByPlaceholder("Example: 12");
  readonly getStatusDropDown = () => this.page.locator("select");
  readonly getProductImages = () => this.page.getByTestId("file-upload-button");
  readonly getCreateProductButton = () => this.page.getByText("Create Product");
  readonly getProductNameError = () =>
    this.page.getByText("Product name is required.");
  readonly getProductNameErrorMsgLen = () =>
    this.page.getByText("Product name must be at least 3 characters.");
  readonly getProductCodeError = () =>
    this.page.getByText("Product code is required.");
  readonly getDuplicateProductCodeError = () =>
    this.page.getByText("A product with this code already exists.");
  readonly getProductCodeErrorForSpecialChar = () =>
    this.page.getByText(
      "Product code may contain letters, numbers, and hyphens only.",
    );
  readonly getCategoryError = () =>
    this.page.getByText("Category is required.");
  readonly getCategoryErrorMsgLen = () =>
    this.page.getByText("Category must be at least 2 characters.");
  readonly getPriceError = () => this.page.getByText("Price is required.");
  readonly getImagesError = () => this.page.getByText("Maximum images reached");

  async waitForCreateProductApi() {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes("/products") &&
        response.request().method() === "POST",
    );
  }

  async navigateToProductPage() {
    await this.getProductsTab().click();
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
    await this.getProductName().fill(productName);
    await this.getProductCode().fill(productCode);
    await this.getCategory().fill(category);
    await this.getPrice().fill(price);
    await this.getStock().fill(stock);
    await this.getStatusDropDown().selectOption(status);
    await this.getProductImages().setInputFiles(images);
  }
  async clickOnCreateProductButton() {
    await this.getCreateProductButton().click();
  }

  verifyProductAdded(productCode:string){
    return this.page.locator("tbody tr").filter({
      hasText:productCode,
    });
  }
}
