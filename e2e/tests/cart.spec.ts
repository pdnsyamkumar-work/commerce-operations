import{test, expect}from '../fixtures/fixtures';
import { CartPage } from '../pageobject/cart';
import { addProductScenarios } from './testData/cartScenarios';

test.describe('Cart Page', () => {

 
  test('Verify user should be able to add product to cart successfully', async ({cartPage}) => {

    
    const product = addProductScenarios.addedProductSuccessfully;

    await cartPage.selectProduct(product.productName);
    const responsePromise = cartPage.waitForAddToCartApi();
    await cartPage.clickAddSelectedProduct();
     const response = await responsePromise;

  await test.step('Validate Add to Cart API response', async () => {
    expect(response.status()).toBe(201);
  });

    await expect(
  cartPage.page.getByRole('heading', { name: product.productName, exact: true })
).toBeVisible();
  });

  test('Verify user should be able to view product details', async ({cartPage}) => {

    const product = addProductScenarios.addedProductSuccessfully;

    await cartPage.selectProduct(product.productName);
    await cartPage.clickAddSelectedProduct();

    await cartPage.clickView();

    await expect(cartPage.xButton).toBeVisible();

    await cartPage.clickXButton();
  });

  test('Verify user should be able to remove product from cart', async ({cartPage}) => {

    const product = addProductScenarios.addedProductSuccessfully;

    await cartPage.selectProduct(product.productName);
    await cartPage.clickAddSelectedProduct();

    await cartPage.clickRemove();
  });

});