import { Page, Locator } from "@playwright/test";
import { ProductData } from "../utils/interfaces/products.interface";

export class Createproductpage {
  // FEEDBACK: Page classes should inherit from base page class
  readonly page: Page;
  readonly productsMenu: Locator;
  readonly productname: Locator;
  readonly productcode: Locator;
  readonly category: Locator;
  readonly price: Locator;
  readonly stock: Locator;
  readonly status: Locator;
  readonly productImages: Locator;
  readonly createproductbutton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsMenu = page.getByRole("button", {
      name: "Products",
      exact: true,
    });
    this.productname = page.getByRole("textbox", { name: "Product name *" });
    this.productcode = page.getByRole("textbox", { name: "Product code *" });
    this.category = page.getByRole("textbox", { name: "Category *" });
    this.price = page.getByRole("textbox", { name: "Price *" });
    this.stock = page.getByRole("textbox", { name: "Stock *" });
    this.status = page.getByLabel("Status *");
    this.productImages = page.locator('input[type="file"]');
    this.createproductbutton = page.getByRole("button", {
      name: "Create Product",
    });
  }

  // FEEDBACK: Method name should be clickOnProductsMenu instead of navigateToProductsPage since the method is performing just the click action on the products menu
  async navigateToProductsPage() {
    await this.productsMenu.click();
  }

  async fillCreateProductForm(data: ProductData) {
    await this.productname.fill(data.pname);
    await this.productcode.fill(data.pcode);
    await this.category.fill(data.cat);
    await this.price.fill(data.price);
    await this.stock.fill(data.stock);
    await this.status.selectOption(data.status);
    if (data.pimage && data.pimage.trim() !== "") {
      await this.productImages.setInputFiles(data.pimage);
    }
  }
  async clickOnCreateProduct() {
    await this.createproductbutton.click();
  }

  // FEEDBACK: This method is not required, instead we can call clickOnCreateProduct directly from the test file
  async createProduct() {
    await this.clickOnCreateProduct();
  }
  async waitForCreateProductResponse() {
    return await this.page.waitForResponse(
      (response) =>
        response.url().includes("/api/products") &&
        response.request().method() == "POST",
    );
  }
}
