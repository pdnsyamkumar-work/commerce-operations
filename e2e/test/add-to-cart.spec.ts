import { test, expect } from "@playwright/test";
import { cartData } from "../testdata/cart-data";
import { CartPage } from "../Pages/cart-page";

test.describe("cart module", () => {
  let cart: CartPage;
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
    cart = new CartPage(page);
    await cart.clickSigninButton();

    await test.step("login", async () => {
      await cart.opencart();
    });
  });
  test("Verify that user is able to add the product to the cart", async ({
    page,
  }) => {
    await test.step("select one product and add that product to cart", async () => {
      await cart.addItem(cartData.product3.id);
      await expect(
      page.getByRole("heading", {
     name: cartData.product3.name,
     exact: true,
  })
).toBeVisible();
    });
  });

   test("verify that user is able to increase the quantity of the product",async({page})=>{
      await test.step("increse the qunatity of the existing product in the cart",async()=>{
          await cart.addItem(cartData.product4.id);
      })
      await test.step("icrease the quantity",async()=>{
       const productCard = page
  .getByRole("heading", {
    name: cartData.product4.name,
    exact: true,
  })
  .locator("xpath=ancestor::div[contains(@class,'rounded-[1.4rem]')]")
  .first();
await productCard.getByRole("button", { name: "+" }).click();
        await expect(cart.quantity()).toHaveText("2");
      })
  });

    test("verify that user is able to decrease the quantity of the product",async({page})=>{
     await test.step("decrease the quantity of the existing product in the cart",async()=>{
      await cart.addItem(cartData.product2.id);
     })
     await test.step("decrease the quantity",async()=>{
         const productCard = page.locator("div").filter({
        has: page.getByRole("heading", {
    name: cartData.product4.name,
   }),
   }); 
     await expect(cart.quantity()).toHaveText("1");
     })
  });
    test("verify that user is able to view the product details by clicking on 'view' button",async({page})=>{
     await test.step("After user add the procduct to the cart the the user clicks on the view button",async()=>{
      await cart.addItem(cartData.product8.id);
     })
     await test.step("user clicks on view button",async()=>{
      await cart.viewproduct(cartData.product8.id);
     })
    })


});
