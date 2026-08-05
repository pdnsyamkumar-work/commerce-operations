import { Page, expect, Response } from "@playwright/test";
import Sign_in from "./sign-in-page";
import { ProductData } from "../utils/interfaces/product.interface";
import { BasePage } from "../Base/Base-page";
import {
  ErrorField,
  TextFiled,
  UploadFileComp,
  DropDownComp,
} from "../enums/component_enums/labes_enums";
import { Buttons } from "../enums/component_enums/labes_enums";

export default class Products extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  product_tab = () => this.page.locator("//button[@title='Products']");
  notification = () => this.page.getByRole("status");

  async clk_prod_tab() {
    //After login in the dashboard it need to clcik on products tab
    await this.product_tab().click();
  }

  // Product Actions
  async fillProductDetails(data: ProductData) {
    //Filing the Products fields
    await this.textfield
      .getInputFiled(TextFiled.PRODUCT_NAME)
      .fill(data.productName);
    await this.textfield
      .getInputFiled(TextFiled.PRODUCT_CODE)
      .fill(data.productCode);
    await this.textfield.getInputFiled(TextFiled.CATEGORY).fill(data.category);
    await this.textfield.getInputFiled(TextFiled.PRICE).fill(data.price);
    await this.textfield.getInputFiled(TextFiled.STOCK).fill(data.stock);
    await this.dropdown.getDropdown(DropDownComp.STATUS).selectOption(data.status);
    await this.uploadfile
      .getUploadFile(UploadFileComp.PRODUCT_IMAGES).setInputFiles(data.imagePath);

    // Remove previously uploaded image if present
    await this.removeExistingImage();

    // Upload new image
    //await this.chooseFilesInput().setInputFiles(data.imagePath);
    await this.uploadfile
      .getUploadFile(UploadFileComp.PRODUCT_IMAGES)
      .setInputFiles(data.imagePath);
  }

  async clickCreateProduct() {
    //After filling the fields it need to click on the create button
    await this.button.getButton(Buttons.CREATE_PRODUCT).click();
  }

  // Image Upload Actions

  async removeExistingImage() {
    if ((await this.button.getButton(Buttons.REMOVE_IMAGE).count()) > 0) {
      await this.button.getButton(Buttons.REMOVE_IMAGE).click();
    }
  }

  async uploadMultipleImages(imagePaths: string[]) {
    //await this.chooseFilesInput().setInputFiles(imagePaths);
    await this.uploadfile
      .getUploadFile(UploadFileComp.PRODUCT_IMAGES)
      .setInputFiles(imagePaths);
  }

  // Validation Methods
  async verifyMaximumImagesReached() {
    //await expect(this.maxImagesMsg()).toBeVisible();
    await this.errormessage.getErrorMessage(ErrorField.PRODUCT_IMAGES_LIMIT);
  }

  async create_btn_state(productsData: ProductData[]) {
    for (const product of productsData) {
      await this.fillProductDetails(product);
      await expect(
        this.button.getButton(Buttons.CREATE_PRODUCT),
      ).toBeDisabled();
      const errorLocator = await this.getExpectedErrorLocator(product);

      if (errorLocator) {
        await expect(errorLocator).toBeVisible();
      }
      console.log(`Validation Passed for ${product.productCode}`);
    }
  }

  async getExpectedErrorLocator(data: ProductData) {
    if (data.productName.trim() === "")
      return this.errormessage.getErrorMessage(
        ErrorField.PRODUCT_NAME_REQUIRED,
      );

    if (data.productName.length < 3)
      return this.errormessage.getErrorMessage(ErrorField.PRODUCT_NAME_MIN);

    if (!/^[A-Za-z0-9\s&'-]+$/.test(data.productName))
      return this.errormessage.getErrorMessage(ErrorField.PRODUCT_NAME_CHAR);

    if (data.productCode.trim() === "")
      return this.errormessage.getErrorMessage(
        ErrorField.PRODUCT_CODE_REQUIRED,
      );

    if (!/^[A-Za-z0-9-]+$/.test(data.productCode))
      return this.errormessage.getErrorMessage(ErrorField.PRODUCT_CODE_CHAR);

    if (data.category.trim() === "")
      return this.errormessage.getErrorMessage(ErrorField.CATEGORY_REQUIRED);

    if (data.category.length < 2)
      return this.errormessage.getErrorMessage(ErrorField.CATEGORY_MIN);

    if (!/^[A-Za-z\s]+$/.test(data.category))
      return this.errormessage.getErrorMessage(ErrorField.CATEGORY_CHAR);

    if (data.price.trim() === "")
      return this.errormessage.getErrorMessage(ErrorField.PRICE_REQUIRED);

    if (data.price.length > 7)
      return this.errormessage.getErrorMessage(ErrorField.PRICE_MAX);

    if (data.stock.trim() === "")
      return this.errormessage.getErrorMessage(ErrorField.STOCK_REQUIRED);

    if (data.stock.length > 5)
      return this.errormessage.getErrorMessage(ErrorField.STOCK_MAX);

    return null;
  }

  //create product method
  async createProduct(data: ProductData) {
    await this.fillProductDetails(data);
    //await this.clickCreateProduct();

    // Click Create Product and wait for API response
    const response = await this.createProductAPI();

    const toastMessage =
      (await this.notification().textContent())?.trim() || "";

    if (toastMessage.includes("A product with this code already exists")) {
      console.log(`Product code already exists: ${data.productCode}`);

      // Validate duplicate response
      expect([400, 409]).toContain(response.status());

      await expect(this.notification()).toContainText(
        "A product with this code already exists",
      );
    } else {
      console.log(`Product created successfully: ${data.productName}`);

      // Validate successful response
      expect(response.ok()).toBeTruthy();

      await expect(this.notification()).toBeVisible();
    }
  }

  async createMultipleProducts(productsData: ProductData[]) {
    for (const product of productsData) {
      await this.createProduct(product);

      const toastMessage =
        (await this.notification().textContent())?.trim() || "";
      if (toastMessage?.includes("A product with this code already exists")) {
        console.log(`Product code already exists: ${product.productCode}`);
        continue;
      }

      console.log(`Product created successfully: ${product.productName}`);
    }
  }

  //Create Product API Method

  async createProductAPI(): Promise<Response> {
    // Start listening for the Create Product API
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes("/api/products") &&
        response.request().method() === "POST",
    );

    // Click the Create Product button
    await this.clickCreateProduct();

    // Wait until the API response is received
    const response = await responsePromise;

    console.log("API Status:", response.status());

    return response;
  }
}

// /*
// Notes
// const responsePromise = this.page.waitForResponse---> (It simply tells Playwright(Start watching every network response.)
// response => --> Now Playwright checks every response using this function
// response.url().includes("/api/products") -->checks the URL. and if it matches only then it continues
// response.request().method() === "POST" -->  This cehcks HTTP Method
// await this.clickCreateProduct(); -->  it executes the  await this.create_prod_btn().click(); and browser clciks create product immediately the browser sends post and /api/products to server

//  "waitForResponse() starts listening for network responses.
//  It waits until it finds a response whose URL contains /api/products and whose request method is POST.
//   When that matching response arrives, it resolves the promise. Then const response = await responsePromise stores
//   the Response object, and by calling response.status() we can get the HTTP status code, such as 201 for a successful product
//   creation or 409 for a duplicate product."
// */

// /*
// Spec File
//     │
//     ▼
// createProduct()
//     │
//     ▼
// fillProductDetails()
//     │
//     ▼
// createProductAPI()
//     │
//     ├── Start listening for API
//     ├── Click Create Product
//     ├── Wait for API Response
//     └── Return Response
//     │
//     ▼
// Validate Response
//     │
//     ▼
// Validate Toast Message
// */

// /*

// import { Page, expect, Response } from "@playwright/test";
// import Sign_in from "./sign-in-page";
// import { ProductData } from "../utils/interfaces/product.interface";
// import { testData } from "../testdata/sign-in-data";
// import { BasePage } from "../Base/Base-page";

// export default class Products extends BasePage{
//   constructor(page: Page) {
//     super(page);
//   }

//   //Locators
//   product_tab = () => this.page.locator("//button[@title='Products']");
//   Prod_name_field = () =>
//     this.page.locator("//input[@placeholder='Example: Canvas Weekender Bag']");
//   Prod_code_field = () => this.page.getByPlaceholder("Example: PRD-111");
//   Prod_category_field = () => this.page.getByPlaceholder("Example: Travel");
//   Prod_price_field = () => this.page.getByPlaceholder("Example: 84");
//   Prod_stock_field = () => this.page.getByPlaceholder("Example: 12");
//   prod_statusdrpdwn = () => this.page.locator("select");
//   chooseFilesInput = () => this.page.locator('input[type="file"]');
//   create_prod_btn = () =>
//     this.page.locator("//button[normalize-space()='Create Product']");
//   notification = () => this.page.getByRole("status");
//   removeImageBtn = () =>
//     this.page.getByRole("button", { name: "Remove image" });
//   maxImagesMsg = () => this.page.getByText("Maximum images reached");

//   // Validation Locators
//   productNameError = () => this.page.getByText("Product name is required.");
//   productNameMinError = () =>
//     this.page.getByText("Product name must be at least 3 characters.");
//   productNameCharError = () =>
//     this.page.getByText(
//       "Product name may contain letters, numbers, spaces, &, apostrophes, or hyphens.",
//     );

//   productCodeError = () => this.page.getByText("Product code is required.");
//   productCodeCharError = () =>
//     this.page.getByText(
//       "Product code may contain letters, numbers, and hyphens only.",
//     );

//   categoryError = () => this.page.getByText("Category is required.");
//   categoryMinError = () =>
//     this.page.getByText("Category must be at least 2 characters.");
//   categoryCharError = () =>
//     this.page.getByText("Category may contain letters and spaces only.");

//   priceError = () => this.page.getByText("Price is required.");
//   priceMaxError = () =>
//     this.page.getByText("Price must be at most 7 characters.");

//   stockError = () => this.page.getByText("Stock is required.");
//   stockMaxError = () =>
//     this.page.getByText("Stock must be at most 5 characters.");

//   // Navigation Methods

//   //This method will first tries to login into the applocationa and perform the add product , we are calling the signin method form the signin page
//   async login_navig_toproducts() {
//     await this.sign_in.navigate();
//     await this.sign_in.login(testData.adminUser);
//     await this.product_tab().click();
//   }

//   async clk_prod_tab() {
//     //After login in the dashboard it need to clcik on products tab
//     await this.product_tab().click();
//   }

//   // Product Actions

//   async fillProductDetails(data: ProductData) {
//     //Filing the Products fields
//     await this.Prod_name_field().fill(data.productName);
//     await this.Prod_code_field().fill(data.productCode);
//     await this.Prod_category_field().fill(data.category);
//     await this.Prod_price_field().fill(data.price);
//     await this.Prod_stock_field().fill(data.stock);
//     await this.prod_statusdrpdwn().selectOption(data.status);
//     // Remove previously uploaded image if present
//     await this.removeExistingImage();

//     // Upload new image
//     await this.chooseFilesInput().setInputFiles(data.imagePath);
//   }

//   async clickCreateProduct() {
//     //After filling the fields it need to click on the create button
//     await this.create_prod_btn().click();
//   }

//   // Image Upload Actions

//   async removeExistingImage() {
//     if ((await this.removeImageBtn().count()) > 0) {
//       await this.removeImageBtn().click();
//     }
//   }

//   async uploadMultipleImages(imagePaths: string[]) {
//     await this.chooseFilesInput().setInputFiles(imagePaths);
//   }

//   // Validation Methods
//   async verifyMaximumImagesReached() {
//     await expect(this.maxImagesMsg()).toBeVisible();
//   }

//   async create_btn_state(productsData: ProductData[]) {
//     for (const product of productsData) {
//       await this.fillProductDetails(product);
//       await expect(this.create_prod_btn()).toBeDisabled();
//       const errorLocator = await this.getExpectedErrorLocator(product);

//       if (errorLocator) {
//         await expect(errorLocator).toBeVisible();
//       }
//       console.log(`Validation Passed for ${product.productCode}`);
//     }
//   }

//   async getExpectedErrorLocator(data: ProductData) {
//     if (data.productName.trim() === "") return this.productNameError();

//     if (data.productName.length < 3) return this.productNameMinError();

//     if (!/^[A-Za-z0-9\s&'-]+$/.test(data.productName))
//       return this.productNameCharError();

//     if (data.productCode.trim() === "") return this.productCodeError();

//     if (!/^[A-Za-z0-9-]+$/.test(data.productCode))
//       return this.productCodeCharError();

//     if (data.category.trim() === "") return this.categoryError();

//     if (data.category.length < 2) return this.categoryMinError();

//     if (!/^[A-Za-z\s]+$/.test(data.category)) return this.categoryCharError();

//     if (data.price.trim() === "") return this.priceError();

//     if (data.price.length > 7) return this.priceMaxError();

//     if (data.stock.trim() === "") return this.stockError();

//     if (data.stock.length > 5) return this.stockMaxError();

//     return null;
//   }

//   //create product method
//   async createProduct(data: ProductData) {
//     await this.fillProductDetails(data);
//     //await this.clickCreateProduct();

//     // Click Create Product and wait for API response
//     const response = await this.createProductAPI();

//     const toastMessage =
//       (await this.notification().textContent())?.trim() || "";

//     if (toastMessage.includes("A product with this code already exists")) {
//       console.log(`Product code already exists: ${data.productCode}`);

//       // Validate duplicate response
//       expect([400, 409]).toContain(response.status());

//       await expect(this.notification()).toContainText(
//         "A product with this code already exists",
//       );
//     } else {
//       console.log(`Product created successfully: ${data.productName}`);

//       // Validate successful response
//       expect(response.ok()).toBeTruthy();

//       await expect(this.notification()).toBeVisible();
//     }
//   }

//   async createMultipleProducts(productsData: ProductData[]) {
//     for (const product of productsData) {
//       await this.createProduct(product);

//       const toastMessage =
//         (await this.notification().textContent())?.trim() || "";
//       if (toastMessage?.includes("A product with this code already exists")) {
//         console.log(`Product code already exists: ${product.productCode}`);
//         continue;
//       }

//       console.log(`Product created successfully: ${product.productName}`);
//     }
//   }

//   //Create Product API Method

//   async createProductAPI(): Promise<Response> {
//     // Start listening for the Create Product API
//     const responsePromise = this.page.waitForResponse(
//       (response) =>
//         response.url().includes("/api/products") &&
//         response.request().method() === "POST",
//     );

//     // Click the Create Product button
//     await this.clickCreateProduct();

//     // Wait until the API response is received
//     const response = await responsePromise;

//     console.log("API Status:", response.status());

//     return response;
//   }
// }

// /*
// Notes
// const responsePromise = this.page.waitForResponse---> (It simply tells Playwright(Start watching every network response.)
// response => --> Now Playwright checks every response using this function
// response.url().includes("/api/products") -->checks the URL. and if it matches only then it continues
// response.request().method() === "POST" -->  This cehcks HTTP Method
// await this.clickCreateProduct(); -->  it executes the  await this.create_prod_btn().click(); and browser clciks create product immediately the browser sends post and /api/products to server

//  "waitForResponse() starts listening for network responses.
//  It waits until it finds a response whose URL contains /api/products and whose request method is POST.
//   When that matching response arrives, it resolves the promise. Then const response = await responsePromise stores
//   the Response object, and by calling response.status() we can get the HTTP status code, such as 201 for a successful product
//   creation or 409 for a duplicate product."
// */

// /*
// Spec File
//     │
//     ▼
// createProduct()
//     │
//     ▼
// fillProductDetails()
//     │
//     ▼
// createProductAPI()
//     │
//     ├── Start listening for API
//     ├── Click Create Product
//     ├── Wait for API Response
//     └── Return Response
//     │
//     ▼
// Validate Response
//     │
//     ▼
// Validate Toast Message
// */
