import { test, expect } from "@playwright/test";
import { createProduct } from "../pageObjects/createProduct";
import { createProductAllScenarios } from "./test-data/createProductScenarios";
import { SignInPage } from "../pageObjects/signInPage";
import { loginScenarios } from "./test-data/signInScenarios";

test.describe("Create product scenarios", async () => {
  let createproduct: createProduct;
  let signin: SignInPage;
  const user = loginScenarios.success;
  test.beforeEach("Login URL", async ({ page }) => {
    createproduct = new createProduct(page);
    signin = new SignInPage(page);
    await page.goto("http://localhost:3000/");
    await signin.enterEmail(user.email);
    await signin.enterPassword(user.password);
    await signin.clickOnSignIn();
  });

  test("Successfull product creation", async () => {
    const product = createProductAllScenarios.Succssfull_Product_Creation;
    await createproduct.navigateToProductPage();
    await createproduct.enterProductDetails(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
    );
    await expect(createproduct.getCreateProductButton()).toBeVisible();
    const responsePromise = createproduct.waitForCreateProductApi();
    await createproduct.clickOnCreateProductButton();
    const response = await responsePromise;
    expect(response.status()).toBe(201);
    await expect(
      createproduct.verifyProductAdded(product.productCode),
    ).toBeVisible();
  });

  test("Product_Creation_With_Duplicate_ProductCode", async () => {
    const product =
      createProductAllScenarios.Product_Creation_With_Duplicate_ProductCode;
    await createproduct.navigateToProductPage();
    await createproduct.enterProductDetails(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
    );
    const responsePromise = createproduct.waitForCreateProductApi();
    await createproduct.clickOnCreateProductButton();
    const response = await responsePromise;
    expect(response.status()).toBe(409);
    await expect(createproduct.getDuplicateProductCodeError()).toBeVisible();
  });

  test("Product_Creation_Without_ProductName", async () => {
    const product =
      createProductAllScenarios.Product_Creation_Without_ProductName;
    await createproduct.navigateToProductPage();
    await createproduct.enterProductDetails(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
    );
    await expect(createproduct.getProductNameError()).toBeVisible();
    await expect(createproduct.getCreateProductButton()).toBeDisabled();
  });

  test("Product_Creation_Without_ProductCode", async () => {
    const product =
      createProductAllScenarios.Product_Creation_Without_ProductCode;
    await createproduct.navigateToProductPage();
    await createproduct.enterProductDetails(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
    );
    await expect(createproduct.getProductCodeError()).toBeVisible();
    await expect(createproduct.getCreateProductButton()).toBeDisabled();
  });

  test("Product_Creation_Without_Category", async () => {
    const product = createProductAllScenarios.Product_Creation_Without_Category;
    await createproduct.navigateToProductPage();
    await createproduct.enterProductDetails(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
    );
    await expect(createproduct.getCategoryError()).toBeVisible();
    await expect(createproduct.getCreateProductButton()).toBeDisabled();
  });

  test("Product_Creation_Without_Price", async () => {
    const product = createProductAllScenarios.Product_Creation_Without_Price;
    await createproduct.navigateToProductPage();
    await createproduct.enterProductDetails(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
    );
    await expect(createproduct.getPriceError()).toBeVisible();
    await expect(createproduct.getCreateProductButton()).toBeDisabled();
  });

  test("Product_Creation_With_ProductName_lessthan3Char", async () => {
    const product =
      createProductAllScenarios.Product_Creation_With_ProductName_lessthan3Char;
    await createproduct.navigateToProductPage();
    await createproduct.enterProductDetails(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
    );
    await expect(createproduct.getProductNameErrorMsgLen()).toBeVisible();
    await expect(createproduct.getCreateProductButton()).toBeDisabled();
  });

  test("Product_Creation_With_SpecialChars_InProductCode", async () => {
    const product =
      createProductAllScenarios.Product_Creation_With_SpecialChars_InProductCode;
    await createproduct.navigateToProductPage();
    await createproduct.enterProductDetails(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
    );
    await expect(
      createproduct.getProductCodeErrorForSpecialChar(),
    ).toBeVisible();
    await expect(createproduct.getCreateProductButton()).toBeDisabled();
  });

  test("Product_Creation_With_MoreThan_6Images", async () => {
    const product =
      createProductAllScenarios.Product_Creation_With_MoreThan_6Images;
    await createproduct.navigateToProductPage();
    await createproduct.enterProductDetails(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
    );
    await expect(createproduct.getImagesError()).toBeVisible();
    await expect(createproduct.getCreateProductButton()).toBeDisabled();
  });
});
