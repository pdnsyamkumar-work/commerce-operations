import { test } from "../fixtures/test-fixture";
import { expect } from "@playwright/test";

test.describe("cart module", () => {

  test.beforeEach(async ({ page, cart }) => {
    await page.goto("http://localhost:3000");

    await cart.header.clickSigninButton();
    await cart.header.openCart();
  });
  test("Verify that user is able to add the product to the cart", async ({ cart ,page,cartData }) => {
    await test.step("select one product and add that product to cart", async () => {
      await cart.addItem(cartData.product3.id);
      await expect(
        page.getByRole("heading", {
          name: cartData.product3.name,
          exact: true,
        }),
      ).toBeVisible();
    });
  });

  test("verify that user is able to increase the quantity of the product", async ({ cart,cartData  }) => {
    await test.step("increse the qunatity of the existing product in the cart", async () => {
      await cart.addItem(cartData.product4.id);
    });
    await test.step("icrease the quantity", async () => {
      const product = cart.getCartItem(
      cartData.product4.name,
      cartData.product4.id
      );

await product.increaseQuantity();
      await expect(cart.quantity()).toHaveText("2");
    });
  });

  test("verify that user is able to decrease the quantity of the product", async ({ cart,cartData  }) => {
    await test.step("decrease the quantity of the existing product in the cart", async () => {
      await cart.addItem(cartData.product2.id);
    });
    await test.step("decrease the quantity", async () => {
      const product = cart.getCartItem(
      cartData.product2.name,
      cartData.product2.id
         );
         await product.increaseQuantity();
          await expect(cart.quantity()).toHaveText("2");

           await product.decreaseQuantity();
            await expect(cart.quantity()).toHaveText("1");
    });
  });
  test("verify that user is able to view the product details by clicking on 'view' button", async ({ cart,cartData  }) => {
    await test.step("After user add the procduct to the cart the the user clicks on the view button", async () => {
      await cart.addItem(cartData.product8.id);
    });
    await test.step("user clicks on view button", async () => {
      const product = cart.getCartItem(
  cartData.product8.name,
  cartData.product8.id
    );

     await product.viewProduct();
     await expect(cart.quantity()).toBeVisible();
    });
  });
  });

