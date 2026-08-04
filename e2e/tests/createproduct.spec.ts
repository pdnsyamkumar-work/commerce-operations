import { test, expect } from "../fixtures/base.fixtures";
import { CartPage } from "../pages/CartPage";
import { productData } from "../testdata/userData";
import { userSigninData } from "../testdata/userData";

test.describe("create product", () => {
  test("create product with valid data", async ({ products, cart }) => {
    await products.fillCreateProductForm(productData.validProduct);
    await expect(products.getCreateProductBtn()).toBeEnabled();

    const createProductResponse = products.page.waitForResponse(
      (response) =>
        response.url().includes("/api/products") &&
        response.request().method() === "POST",
    );

    await products.clickOnCreateProduct();
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
  test("create product with draft product", async ({ products }) => {
    await products.fillCreateProductForm(productData.draftProduct);
    await expect(products.getCreateProductBtn()).toBeEnabled();
    await products.clickOnCreateProduct();
  });
  test("create product without product name", async ({ products }) => {
    await products.fillCreateProductForm(productData.emptyProductName);
    await expect(products.getProductNameError()).toHaveText(
      productData.emptyProductName.expected,
    );
    await expect(products.getCreateProductBtn()).not.toBeEnabled();
  });
  test("create product without product code", async ({ products }) => {
    await products.fillCreateProductForm(productData.emptyProductCode);
    await expect(products.getProductCodeError()).toHaveText(
      productData.emptyProductCode.expected,
    );
    await expect(products.getCreateProductBtn()).not.toBeEnabled();
  });
  test("create product without category", async ({ products }) => {
    await products.fillCreateProductForm(productData.emptyCategory);
    await expect(products.getCategoryError()).toHaveText(
      productData.emptyCategory.expected,
    );
    await expect(products.getCreateProductBtn()).not.toBeEnabled();
  });
  test("create product without price", async ({ products }) => {
    await products.fillCreateProductForm(productData.emptyPrice);
    await expect(products.getPriceError()).toHaveText(
      productData.emptyPrice.expected,
    );
    await expect(products.getCreateProductBtn()).not.toBeEnabled();
  });
  test("create product without stock", async ({ products }) => {
    await products.fillCreateProductForm(productData.emptyStock);
    await expect(products.getCreateProductBtn()).not.toBeEnabled();
  });
  test("create product without image", async ({ products }) => {
    await products.fillCreateProductForm(productData.noImages);

    await expect(products.getCreateProductBtn()).not.toBeEnabled();
  });

  test("create product with 7 images", async ({ products }) => {
    await products.fillCreateProductForm(productData.maxImages);
    await expect(products.getProductImagesError()).toHaveText(
      productData.maxImages.expected,
    );
  });
  test("create product with duplicate data", async ({ products }) => {
    await products.fillCreateProductForm(productData.duplicateProduct);
    await products.clickOnCreateProduct();
    await expect(products.getProductCodeError()).toHaveText(
      productData.duplicateProduct.expected,
    );
  }); //
});
