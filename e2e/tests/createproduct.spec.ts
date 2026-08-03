import { test, expect } from "@playwright/test";
import { SigninPage } from "../pages/signinPage";
import { createProduct } from "../pages/createProduct";
import { productData } from "../testdata/userData";
import { userSigninData } from "../testdata/userData";
import { CartPage } from "../pages/CartPage";
let createProducts: createProduct;
let login: SigninPage;
let cart: CartPage;

test.describe("create product", () => {
  test.beforeEach("go to products page", async ({ page }) => {
    createProducts = new createProduct(page);
    login = new SigninPage(page);
    cart = new CartPage(page);
    await page.goto("http://localhost:3000/");
    await login.gotosignin();
    await login.signin(userSigninData.validData);
    await login.clicksignIn();
    await expect(login.getDashboardHeading()).toBeVisible();

    await createProducts.navigateToProductsPage();
    await expect(createProducts.getProductHeading()).toBeVisible();
  });
  test("create product with valid data", async ({ page }) => {
    await createProducts.fillCreateProductForm(productData.validProduct);
    await expect(createProducts.getCreateProductBtn()).toBeEnabled();

    const createProductResponse = page.waitForResponse(
      (response) =>
        response.url().includes("/api/products") &&
        response.request().method() === "POST",
    );

    await createProducts.clickOnCreateProduct();
    const response = await createProductResponse;

    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    expect(responseBody.product.name).toBe(
      productData.validProduct.productName,
    );
    expect(responseBody.product.productCode).toBe(
      productData.validProduct.productCode,
    );
    await cart.clickOnCartIcon();
    await cart.clickElement(cart.getDropdownField());
    await expect(
      cart.getDropdownOption(productData.validProduct.productName),
    ).toBeVisible();
  });
  test("create product with draft product", async () => {
    await createProducts.fillCreateProductForm(productData.draftProduct);
    await expect(createProducts.getCreateProductBtn()).toBeEnabled();
    await createProducts.clickOnCreateProduct();
  });
  test("create product without product name", async ({ page }) => {
    await createProducts.fillCreateProductForm(productData.emptyProductName);
    await expect(createProducts.getProductNameError()).toHaveText(
      productData.emptyProductName.expected,
    );
    await expect(createProducts.getCreateProductBtn()).not.toBeEnabled();
  });
  test("create product without product code", async ({ page }) => {
    await createProducts.fillCreateProductForm(productData.emptyProductCode);
    await expect(createProducts.getProductCodeError()).toHaveText(
      productData.emptyProductCode.expected,
    );
    await expect(createProducts.getCreateProductBtn()).not.toBeEnabled();
  });
  test("create product without category", async ({ page }) => {
    await createProducts.fillCreateProductForm(productData.emptyCategory);
    await expect(createProducts.getCategoryError()).toHaveText(
      productData.emptyCategory.expected,
    );
    await expect(createProducts.getCreateProductBtn()).not.toBeEnabled();
  });
  test("create product without price", async ({ page }) => {
    await createProducts.fillCreateProductForm(productData.emptyPrice);
    await expect(createProducts.getPriceError()).toHaveText(
      productData.emptyPrice.expected,
    );
    await expect(createProducts.getCreateProductBtn()).not.toBeEnabled();
  });
  test("create product without stock", async () => {
    await createProducts.fillCreateProductForm(productData.emptyStock);
    await expect(createProducts.getCreateProductBtn()).not.toBeEnabled();
  });
  test("create product without image", async () => {
    await createProducts.fillCreateProductForm(productData.noImages);

    await expect(createProducts.getCreateProductBtn()).not.toBeEnabled();
  });

  test("create product with 7 images", async ({ page }) => {
    await createProducts.fillCreateProductForm(productData.maxImages);
    await expect(createProducts.getProductImagesError()).toHaveText(
      productData.maxImages.expected,
    );
  });
  test("create product with duplicate data", async ({ page }) => {
    await createProducts.fillCreateProductForm(productData.duplicateProduct);
    await createProducts.clickOnCreateProduct();
    await expect(createProducts.getProductCodeError()).toHaveText(
      productData.duplicateProduct.expected,
    );
  }); //
});
