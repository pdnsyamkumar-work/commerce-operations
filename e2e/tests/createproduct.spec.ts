import { test, expect } from "../fixtures/fixtures";
import { createProductAllScenarios } from './testData/createproductsScenarios';
import { ErrorFields } from '../enums/inlineErrors.enums';

test.describe("Create Product Page", () => {

  


  test("User should be able to create product successfully", async ({ createProductPage }) => {
    
    const product =
      createProductAllScenarios.Successful_Product_Creation;

    await createProductPage.createProduct(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
      false
    );
     const responsePromise = createProductPage.waitForCreateProductApi();

  await createProductPage.createProductButton.click();

  const response = await responsePromise;

  await test.step("Validate create product API response", async () => {
    expect(response.status()).toBe(201);
  });
  });


  test("User should see validation message for duplicate product code", async ({ createProductPage }) => {
   

    const product =createProductAllScenarios.Product_Creation_With_Duplicate_ProductCode;

    await createProductPage.createProduct(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
      
    );

   await expect(
  createProductPage.errormessage.getErrorMessage(ErrorFields.PRODUCTS)
).toHaveText("A product with this code already exists.");});


  test("User should see validation message when product name is empty", async ({ createProductPage }) => {
  

    const product =
      createProductAllScenarios.Product_Creation_Without_ProductName;

    await createProductPage.createProduct(
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
  createProductPage.errormessage.getErrorMessage(ErrorFields.PRODUCTS)
).toHaveText("Product name is required.");
  });


  test("User should see validation message when product code is empty", async ({ createProductPage }) => {
    

    const product =
      createProductAllScenarios.Product_Creation_Without_ProductCode;

    await createProductPage.createProduct(
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
  createProductPage.errormessage.getErrorMessage(ErrorFields.PRODUCTS)
).toHaveText("Product code is required.");
  });

});