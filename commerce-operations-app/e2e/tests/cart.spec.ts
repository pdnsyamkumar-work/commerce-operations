import { expect } from "@playwright/test";
import { loginScenarios } from "./test-data/signInScenarios";
import { test } from "../Fixtures/fixtures";
import { addProductScenarios } from "./test-data/addProductToCartScenarios";
import {createProductAllScenarios} from "./test-data/createProductScenarios";

test.describe("Cart Page", () => {

  test("User should successfully add a product to cart", async ({signinPage, createProductPage,cartPage}) => {
    const product = createProductAllScenarios.Succssfull_Product_Creation;
    const user = loginScenarios.success;
    await signinPage.fillLoginCredentials(user.email,user.password);
    const responsePromise = signinPage.waitForLoginApi();
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
    const productResponsePromise = createProductPage.waitForCreateProductApi();
    await createProductPage.clickOnCreateProductButton();
    const productResponse = await productResponsePromise;
    expect(productResponse.status()).toBe(201);
    await cartPage.navigateToCartPage();
    await cartPage.openProductsDropdown();
    await expect(cartPage.getProductOption(product.productName)).toBeVisible();
    await cartPage.selectProduct(product.productName);
    await cartPage.clickOnAddProductButton();
  });

  test("Adding the product which is not present in the dropdown", async ({signinPage, cartPage}) => {
    const product = addProductScenarios.addingProductWhichIsNotPresent;
    const user = loginScenarios.success;
    await signinPage.fillLoginCredentials(user.email,user.password);
    await signinPage.clickOnSignInButton();
    await cartPage.navigateToCartPage();
    await cartPage.openProductsDropdown();
    await expect(
      cartPage.getProductOption(product.productName),
    ).not.toBeVisible();
  });

  test("Removing the product from the cart", async ({signinPage, cartPage}) => {
    const product = addProductScenarios.addedProductSuccessfully;
    const user = loginScenarios.success;
    await signinPage.fillLoginCredentials(user.email,user.password);
    await signinPage.clickOnSignInButton();
    await cartPage.navigateToCartPage();
    await cartPage.openProductsDropdown();
    await expect(cartPage.getProductOption(product.productName)).toBeVisible();
    await cartPage.selectProduct(product.productName);
    await cartPage.clickOnAddProductButton();
    await cartPage.clickOnDeleteTheProduct(product.productName);
  });

  test("Updating the quantity of the product", async ({signinPage, cartPage}) => {
    const product = addProductScenarios.addedProductSuccessfully;
    const user = loginScenarios.success;
    await signinPage.fillLoginCredentials(user.email,user.password);
    await signinPage.clickOnSignInButton();
    await cartPage.navigateToCartPage();
    await cartPage.openProductsDropdown();
    await expect(cartPage.getProductOption(product.productName)).toBeVisible();
    await cartPage.selectProduct(product.productName);
    await cartPage.clickOnAddProductButton();
    await cartPage.increaseProductQuantity(product.productName);
    await cartPage.decreaseProductQuantity(product.productName);
  });

  test("Viewing the product details", async ({signinPage, cartPage}) => {
    const product = addProductScenarios.addedProductSuccessfully;
    const user = loginScenarios.success;
    await signinPage.fillLoginCredentials(user.email,user.password);
    await signinPage.clickOnSignInButton();
    await cartPage.navigateToCartPage();
    await cartPage.openProductsDropdown();
    await expect(cartPage.getProductOption(product.productName)).toBeVisible();
    await cartPage.selectProduct(product.productName);
    await cartPage.clickOnAddProductButton();
    await cartPage.clickOnViewProductDetails(product.productName);
    await cartPage.clickOnCloseCartItemDialog();
  });
});