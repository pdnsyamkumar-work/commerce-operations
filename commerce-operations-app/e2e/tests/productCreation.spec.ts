import { expect } from "@playwright/test";
import { createProductAllScenarios } from "./test-data/createProductScenarios";
import { test } from "../Fixtures/fixtures";
import { Buttons } from "../enums/buttons";
import { ErrorFields } from "../enums/inLineErrors";
import { loginScenarios } from "./test-data/signInScenarios";

test.describe("Create product scenarios", async () => {
 
  test.only("Successfull product creation", async ({signinPage, createProductPage}) => {
    const product = createProductAllScenarios.Succssfull_Product_Creation;
    const user = loginScenarios.success;
    await signinPage.fillLoginCredentials(user.email,user.password);
    await signinPage.clickOnSignInButton();
    await createProductPage.navigateToProductPage();
    await createProductPage.enterProductDetails(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
    );
    await expect(createProductPage.button.getButton(Buttons.CREATE_PRODUCT)).toBeVisible();
    const responsePromise = createProductPage.waitForCreateProductApi();
    await createProductPage.clickOnCreateProductButton();
    const response = await responsePromise;
    expect(response.status()).toBe(201);
    await expect(
      createProductPage.verifyProductAdded(product.productCode),
    ).toBeVisible();
  });

  test("Product_Creation_With_Duplicate_ProductCode", async ({signinPage,createProductPage}) => {
    const product = createProductAllScenarios.Product_Creation_With_Duplicate_ProductCode;
    const user = loginScenarios.success
    await signinPage.fillLoginCredentials(user.email,user.password);
    await signinPage.clickOnSignInButton();
    await createProductPage.navigateToProductPage();
    await createProductPage.enterProductDetails(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
    );
    const responsePromise = createProductPage.waitForCreateProductApi();
    await createProductPage.clickOnCreateProductButton();
    const response = await responsePromise;
    expect(response.status()).toBe(409);
    await expect(createProductPage.errorField.getErrorMessage(ErrorFields.PRODUCT_CODE)).toBeVisible();
  });

  test("Product_Creation_Without_ProductName", async ({signinPage,createProductPage}) => {
    const product =
      createProductAllScenarios.Product_Creation_Without_ProductName;
    const user = loginScenarios.success;
    await signinPage.fillLoginCredentials(user.email, user.password);
    await signinPage.clickOnSignInButton();
    await createProductPage.navigateToProductPage();
    await createProductPage.enterProductDetails(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
    );
   await expect(createProductPage.errorField.getErrorMessage(ErrorFields.PRODUCT_NAME)).toBeVisible();
    await expect(createProductPage.button.getButton(Buttons.CREATE_PRODUCT)).toBeDisabled();
  });

  test("Product_Creation_Without_ProductCode", async ({signinPage, createProductPage}) => {
    const product =
      createProductAllScenarios.Product_Creation_Without_ProductCode;
    const user = loginScenarios.success;
    await signinPage.fillLoginCredentials(user.email, user.password);
    await signinPage.clickOnSignInButton();
    await createProductPage.navigateToProductPage();
    await createProductPage.enterProductDetails(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
    );
   await expect(createProductPage.errorField.getErrorMessage(ErrorFields.PRODUCT_CODE)).toBeVisible();
    await expect(createProductPage.button.getButton(Buttons.CREATE_PRODUCT)).toBeDisabled();
  });

  test("Product_Creation_Without_Category", async ({signinPage,createProductPage}) => {
    const product = createProductAllScenarios.Product_Creation_Without_Category;
    const user = loginScenarios.success;
    await signinPage.fillLoginCredentials(user.email, user.password);
    await signinPage.clickOnSignInButton();
    await createProductPage.navigateToProductPage();
    await createProductPage.enterProductDetails(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
    );
   await expect(createProductPage.errorField.getErrorMessage(ErrorFields.CATEGORY)).toBeVisible();
   await expect(createProductPage.button.getButton(Buttons.CREATE_PRODUCT)).toBeDisabled();
  });

  test("Product_Creation_Without_Price", async ({signinPage,createProductPage}) => {
    const product = createProductAllScenarios.Product_Creation_Without_Price;
    const user = loginScenarios.success;
    await signinPage.fillLoginCredentials(user.email, user.password);
    await signinPage.clickOnSignInButton();
    await createProductPage.navigateToProductPage();
    await createProductPage.enterProductDetails(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
    );
    await expect(createProductPage .errorField.getErrorMessage(ErrorFields.PRICE)).toBeVisible();
    await expect(createProductPage.button.getButton(Buttons.CREATE_PRODUCT)).toBeDisabled();
  });

  test("Product_Creation_With_ProductName_lessthan3Char", async ({signinPage,createProductPage}) => {
    const product =
      createProductAllScenarios.Product_Creation_With_ProductName_lessthan3Char;
    const user = loginScenarios.success;
    await signinPage.fillLoginCredentials(user.email, user.password);
    await signinPage.clickOnSignInButton();
    await createProductPage.navigateToProductPage();
    await createProductPage.enterProductDetails(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
    );
   await expect(createProductPage.errorField.getErrorMessage(ErrorFields.PRODUCT_NAME)).toBeVisible();
   await expect(createProductPage.button.getButton(Buttons.CREATE_PRODUCT)).toBeDisabled();
  });

  test("Product_Creation_With_SpecialChars_InProductCode", async ({signinPage, createProductPage}) => {
    const product =
      createProductAllScenarios.Product_Creation_With_SpecialChars_InProductCode;
    const user = loginScenarios.success;
    await signinPage.fillLoginCredentials(user.email, user.password);
    await signinPage.clickOnSignInButton();
    await createProductPage.navigateToProductPage();
    await createProductPage.enterProductDetails(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
    );
   await expect(createProductPage.errorField.getErrorMessage(ErrorFields.PRODUCT_CODE)).toBeVisible();
   await expect(createProductPage.button.getButton(Buttons.CREATE_PRODUCT)).toBeDisabled();
  });

  test("Product_Creation_With_MoreThan_6Images", async ({signinPage, createProductPage}) => {
    const product =
      createProductAllScenarios.Product_Creation_With_MoreThan_6Images;
    const user = loginScenarios.success;
    await signinPage.fillLoginCredentials(user.email, user.password);
    await signinPage.clickOnSignInButton();
    await createProductPage.navigateToProductPage();
    await createProductPage.enterProductDetails(
      product.productName,
      product.productCode,
      product.category,
      product.price,
      product.stock,
      product.status,
      product.imagePaths,
    );
    await expect(createProductPage.errorField.getErrorMessage(ErrorFields.PRODUCT_IMAGES)).toBeVisible();
  });
});
