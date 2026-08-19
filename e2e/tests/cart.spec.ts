import { test, expect } from '@playwright/test';
import { SignInPage } from '../pageobject/signin';
import { CartPage } from '../pageobject/cart';
import { addProductScenarios } from './testData/cartScenarios';

test.describe('Cart Page', () => {

  test.beforeEach(async ({ page }) => {

    const signinPage = new SignInPage(page);
    const cartPage = new CartPage(page);

    await signinPage.navigate('http://localhost:3000/');

    await signinPage.login(
      'admin@commerce.test',
      'Commerce@123'
    );

    await cartPage.openCart();
  });

  test('Verify user should be able to add product to cart successfully', async ({ page }) => {

    const cartPage = new CartPage(page);
    const product = addProductScenarios.addedProductSuccessfully;

    await cartPage.selectProduct(product.productName);
    const responsePromise = cartPage.waitForAddToCartApi();
    await cartPage.clickAddSelectedProduct();
     const response = await responsePromise;

  await test.step('Validate Add to Cart API response', async () => {
    expect(response.status()).toBe(201);
  });

    await expect(
  page.getByRole('heading', { name: product.productName, exact: true })
).toBeVisible();
  });

  test('Verify user should be able to view product details', async ({ page }) => {

    const cartPage = new CartPage(page);
    const product = addProductScenarios.addedProductSuccessfully;

    await cartPage.selectProduct(product.productName);
    await cartPage.clickAddSelectedProduct();

    await cartPage.clickView();

    await expect(cartPage.xButton).toBeVisible();

    await cartPage.clickXButton();
  });

  test('Verify user should be able to remove product from cart', async ({ page }) => {

    const cartPage = new CartPage(page);
    const product = addProductScenarios.addedProductSuccessfully;

    await cartPage.selectProduct(product.productName);
    await cartPage.clickAddSelectedProduct();

    await cartPage.clickRemove();
  });

});