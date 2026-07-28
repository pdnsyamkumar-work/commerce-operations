import { test, expect } from "@playwright/test";
import { cartPage } from "../pageObjects/CartPage";
import { SignInPage } from "../pageObjects/signInPage";
import { loginScenarios } from "./test-data/signInScenarios";
import { addProductScenarios } from "./test-data/addProductToCartScenarios";

test.describe("Cart Page", () => {
  let user = loginScenarios.success;
  let CartPage: cartPage;
  let signInPage: SignInPage;

  test.beforeEach(async ({ page }) => {
    CartPage = new cartPage(page);
    signInPage = new SignInPage(page);

    await signInPage.navigate("http://localhost:3000/");
    await signInPage.enterEmail(user.email);
    await signInPage.enterPassword(user.password);
    await signInPage.clickOnSignIn();
    await CartPage.navigateToCartPage();
  });

  test.step("User should successfully add a product to cart", async ({}) => {
    const product = addProductScenarios.addedProductSuccessfully;
    await CartPage.openProductsDropdown();
    await expect(CartPage.getProductOption(product.productName)).toBeVisible();
    await CartPage.selectProduct(product.productName);
    await CartPage.clickOnAddProductButton();
    await expect(
      CartPage.getAllTheAddedroducts().filter({ hasText: product.productName }),
    ).toBeVisible();
  });

  test.step("Adding the product which is not present in the dropdown", async () => {
    const product = addProductScenarios.addingProductWhichIsNotPresent;
    await CartPage.openProductsDropdown();
    await expect(
      CartPage.getProductOption(product.productName),
    ).not.toBeVisible();
  });

  test.step("Removing the product from the cart", async ({}) => {
    const product = addProductScenarios.addedProductSuccessfully;
    await CartPage.openProductsDropdown();
    await expect(CartPage.getProductOption(product.productName)).toBeVisible();
    await CartPage.selectProduct(product.productName);
    await CartPage.clickOnAddProductButton();
    await CartPage.clickOnDeleteTheProduct(product.productName);
  });

  test.step("Removing the product which is added in the Cart", async ({}) => {
    const product = addProductScenarios.addedProductSuccessfully;
    await CartPage.openProductsDropdown();
    await expect(CartPage.getProductOption(product.productName)).toBeVisible();
    await CartPage.selectProduct(product.productName);
    await CartPage.clickOnAddProductButton();
    await CartPage.clickOnDeleteTheProduct(product.productName);
    await CartPage.clickOnRemoveConfirmButton();
    await expect(
      CartPage.getAllTheAddedroducts().filter({ hasText: product.productName }),
    ).not.toBeVisible();
  });

  test.step("Updating the quantity of the product", async ({}) => {
    const product = addProductScenarios.addedProductSuccessfully;
    await CartPage.openProductsDropdown();
    await expect(CartPage.getProductOption(product.productName)).toBeVisible();
    await CartPage.selectProduct(product.productName);
    await CartPage.clickOnAddProductButton();
    await CartPage.increaseProductQuantity(product.productName);
    await CartPage.decreaseProductQuantity(product.productName);
  });

  test.only("Viewing the product details", async ({}) => {
    const product = addProductScenarios.addedProductSuccessfully;
    await CartPage.openProductsDropdown();
    await expect(CartPage.getProductOption(product.productName)).toBeVisible();
    await CartPage.selectProduct(product.productName);
    await CartPage.clickOnAddProductButton();
    await CartPage.clickOnViewProductDetails(product.productName);
    await expect(CartPage.getCartTitle()).toHaveText(product.productName);
    let title = await CartPage.getCartTitle().textContent();
    console.log(title);
    await CartPage.clickOnCloseButton();
  });
});