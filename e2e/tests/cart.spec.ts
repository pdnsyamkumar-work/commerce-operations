import { test, expect } from "../fixtures/base.fixtures";

test.describe(" cart page", () => {
  test.beforeEach(async ({ cart }) => {
    await cart.clickOnCartIcon();
  });
  test("should add selected product to cart", async ({
    cart,
    createProductData,
  }) => {
    const data = createProductData({
      productName: "Metro Lunch Tote",
      price: "34",
    });
    await cart.AddItemToCart(data.productName);

    await expect(cart.getDropdownField()).toContainText(data.productName);
    await expect(cart.getProductName(data.productName)).toBeVisible();
    await expect(cart.getProductPrice(data.productName)).toContainText(
      data.price,
    );
  });
  test("should increase product quantity in cart", async ({
    cart,
    createProductData,
  }) => {
    const data = createProductData({ productName: "Metro Lunch Tote" });
    await cart.AddItemToCart(data.productName);
    const initialCount = Number(
      await cart.getProductQuantity(data.productName).textContent(),
    );
    await cart.IncreaseQty(data.productName);
    await cart.clickElement(cart.getViewButton(data.productName));
    await expect(cart.getCartCount()).toContainText(String(initialCount + 1));
  });
  test("should remove product from cart", async ({
    cart,
    createProductData,
  }) => {
    const data = createProductData({ productName: "Canvas Weekender Bag" });
    await cart.AddItemToCart(data.productName);
    await cart.removeItem(data.productName);
    await expect(cart.getProductName(data.productName)).not.toBeVisible();
  });
});
