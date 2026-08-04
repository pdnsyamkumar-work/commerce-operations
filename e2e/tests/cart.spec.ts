import { test, expect } from "../fixtures/base.fixtures";
import { userSigninData } from "../testdata/userData";

import { productData } from "../testdata/userData";
import { cartData } from "../testdata/userData";

test.describe(" cart page", () => {
  test.beforeEach(async ({ cart }) => {
    await cart.clickOnCartIcon();
  });
  test("should add selected product to cart", async ({ cart}) => {
    await cart.AddItemToCart(cartData.product1.itemName);

    await expect(cart.getDropdownField()).toContainText(
      cartData.product1.itemName,
    );
    await expect(cart.getProductName(cartData.product1.itemName)).toBeVisible();
    await expect(
      cart.getProductPrice(cartData.product1.itemName),
    ).toContainText(cartData.product1.price);
  });
  test("should increase product quantity in cart", async ({ cart }) => {
    await cart.AddItemToCart(cartData.product1.itemName);
    const initialCount = Number(
      await cart.getProductQuantity(cartData.product1.itemName).textContent(),
    );
    await cart.IncreaseQty(cartData.product1.itemName);
    await cart.clickElement(cart.getViewButton(cartData.product1.itemName));
    await expect(cart.getCartCount()).toContainText(String(initialCount + 1));
  });
  test("should remove product from cart", async ({ cart }) => {
    await cart.AddItemToCart(cartData.product2.itemName);
    await cart.removeItem(cartData.product2.itemName);
    await expect(
      cart.getProductName(cartData.product2.itemName),
    ).not.toBeVisible();
  });
});
