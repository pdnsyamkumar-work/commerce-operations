import { test as base } from "@playwright/test";
import { CartPage } from "../Pages/cart-page";
import { cartData } from "../testdata/cart-data";

type Fixtures = {
  cart: CartPage;
  cartData: typeof cartData;
};

export const test = base.extend<Fixtures>({
  cart: async ({ page }, use) => {
    const cart = new CartPage(page);

    await use(cart);
  },

  cartData: async ({}, use) => {
    await use(cartData);
  },
});

export { expect } from "@playwright/test";