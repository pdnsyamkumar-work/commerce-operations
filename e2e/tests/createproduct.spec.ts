import { test, expect } from '@playwright/test';
import { SignInPage } from '../pageobject/signin';
import { CreateProductPage } from '../pageobject/createproduct';
import { createProductAllScenarios } from './testData/createproductsScenarios';

test.describe("Create Product Page", () => {

  test.beforeEach(async ({ page }) => {
    const signinpage = new SignInPage(page);
    const createProduct = new CreateProductPage(page);

    await signinpage.navigate("http://localhost:3000/");

    await signinpage.login(
      'admin@commerce.test',
      'Commerce@123'
    );

    await createProduct.goToProducts();
  });


  test("User should be able to create product successfully", async ({ page }) => {
    const createProduct = new CreateProductPage(page);

    const product =
      createProductAllScenarios.Successful_Product_Creation;

    await createProduct.createProduct(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
      false
    );
     const responsePromise = createProduct.waitForCreateProductApi();

  await createProduct.createProductButton.click();

  const response = await responsePromise;

  await test.step("Validate create product API response", async () => {
    expect(response.status()).toBe(201);
  });
  });


  test("User should see validation message for duplicate product code", async ({ page }) => {
    const createProduct = new CreateProductPage(page);

    const product =createProductAllScenarios.Product_Creation_With_Duplicate_ProductCode;

    await createProduct.createProduct(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
      
    );

   await expect(page.locator('p[role="alert"]')).toContainText("A product with this code already exists.");});


  test("User should see validation message when product name is empty", async ({ page }) => {
    const createProduct = new CreateProductPage(page);

    const product =
      createProductAllScenarios.Product_Creation_Without_ProductName;

    await createProduct.createProduct(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
      false
    );

    await expect(
      page.getByText(
        "Product name is required.",
        { exact: true }
      )
    ).toBeVisible();
  });


  test("User should see validation message when product code is empty", async ({ page }) => {
    const createProduct = new CreateProductPage(page);

    const product =
      createProductAllScenarios.Product_Creation_Without_ProductCode;

    await createProduct.createProduct(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
      false
    );

    await expect(
      page.getByText(
        "Product code is required.",
        { exact: true }
      )
    ).toBeVisible();
  });

});