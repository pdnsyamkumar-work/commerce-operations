import { test, expect } from "../fixtures/base.fixtures";
import { CartPage } from "../pages/CartPage";

import { InlineError } from "../enums/component-enum/InlineError.enum";

test.describe("create product", () => {
  test("create product with valid data", async ({
    products,
    cart,
    createProductData,
  }) => {
    const data = createProductData();
    await products.fillCreateProductForm(data);
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

    expect(responseBody.product.name).toBe(data.productName);
    expect(responseBody.product.productCode).toBe(data.productCode);
    await cart.clickOnCartIcon();
    await cart.clickElement(cart.getDropdownField());
    await expect(cart.getDropdownOption(data.productName)).toBeVisible();
  });
  test("create product with draft product", async ({
    products,
    createProductData,
  }) => {
    const data = createProductData({ status: "Draft" });
    await products.fillCreateProductForm(data);
    await expect(products.getCreateProductBtn()).toBeEnabled();
    await products.clickOnCreateProduct();
  });
  test("create product without product name", async ({
    products,
    createProductData,
  }) => {
    const data = createProductData({ productName: "" });
    await products.fillCreateProductForm(data);
    await expect(products.getProductNameError()).toHaveText(
      InlineError.PRODUCT_NAME_REQUIRED,
    );
    await expect(products.getCreateProductBtn()).not.toBeEnabled();
  });
  test("create product without product code", async ({
    products,
    createProductData,
  }) => {
    const data = createProductData({ productCode: "" });
    await products.fillCreateProductForm(data);
    await expect(products.getProductCodeError()).toHaveText(
      InlineError.PRODUCT_CODE_REQUIRED,
    );
    await expect(products.getCreateProductBtn()).not.toBeEnabled();
  });
  test("create product without category", async ({
    products,
    createProductData,
  }) => {
    const data = createProductData({ category: "" });
    await products.fillCreateProductForm(data);
    await expect(products.getCategoryError()).toHaveText(
      InlineError.CATEGORY_REQUIRED,
    );
    await expect(products.getCreateProductBtn()).not.toBeEnabled();
  });
  test("create product without price", async ({
    products,
    createProductData,
  }) => {
    const data = createProductData({ price: "" });
    await products.fillCreateProductForm(data);
    await expect(products.getPriceError()).toHaveText(
      InlineError.PRODUCT_PRICE_REQUIRED,
    );
    await expect(products.getCreateProductBtn()).not.toBeEnabled();
  });
  test("create product without stock", async ({
    products,
    createProductData,
  }) => {
    const data = createProductData({ stock: "" });
    await products.fillCreateProductForm(data);
    await expect(products.getCreateProductBtn()).not.toBeEnabled();
  });
  test("create product without image", async ({
    products,
    createProductData,
  }) => {
    const data = createProductData({ images: [] });
    await products.fillCreateProductForm(data);

    await expect(products.getCreateProductBtn()).not.toBeEnabled();
  });

  test("create product with 7 images", async ({
    products,
    createProductData,
  }) => {
    const data = createProductData({
      images: [
        "e2e/testdata/images/image7.png",
        "e2e/testdata/images/image8.png",
        "e2e/testdata/images/image.png",
        "e2e/testdata/images/image1.png",
        "e2e/testdata/images/image2.png",
        "e2e/testdata/images/image3.png",
        "e2e/testdata/images/image4.png",
      ],
    });
    await products.fillCreateProductForm(data);
    await expect(products.getProductImagesError()).toHaveText(
      InlineError.MAXIMUM_IMAGE,
    );
  });
  // test("create product with duplicate data", async ({ products }) => {
  //   await products.fillCreateProductForm(productData.duplicateProduct);
  //   await products.clickOnCreateProduct();
  //   await expect(products.getProductCodeError()).toHaveText(
  //     InlineError.PRODUCT_CODE_ERROR,
  //   );
  // }); //
});
