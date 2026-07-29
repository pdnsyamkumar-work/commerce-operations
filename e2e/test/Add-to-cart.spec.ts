import { test } from "../Fixtures/cart-fixture";
import { expect } from "@playwright/test";
//import carts from "../Pages/cart-page";
import { cartData } from "../testdata/cart-data";

test.describe("Cart Module", () => {
  test("Verify user can add product to cart", async ({ cartpage }) => {
    await test.step("Choose the product from the dropdown", async () => {
      await cartpage.choose_prod_frm_drpdwn(cartData.product2);
    });

    await test.step("Click on Add Selected Product button", async () => {
      await cartpage.click_Add_Prd_Btn();
    });
  });

  test("Remove the exsitng items present in the cart", async ({ cartpage }) => {
    await test.step("Remove the Added product from the cart", async () => {
      await cartpage.choose_prod_frm_drpdwn(cartData.product2);
      await cartpage.click_Add_Prd_Btn();
      await cartpage.remove_prdt(cartData.product2);
    });

    await test.step("Verify Remove confirmation popup is displayed", async () => {
      await expect(cartpage.remove_popup()).toBeVisible();
      await expect(cartpage.remove_popup_title()).toBeVisible();
    });
    await test.step("Click Cancel button", async () => {
      await cartpage.click_cancel_btn();
    });
    await test.step("Verify popup is closed", async () => {
      await expect(cartpage.remove_popup()).toBeHidden();
    });
    await test.step("Click Remove button again", async () => {
      await cartpage.remove_prdt(cartData.product2);
    });
    await test.step("Click Remove Item button", async () => {
      await cartpage.click_confirm_remove_btn();
    });
  });

  test("Veriy that prod qnty increae and decrease", async ({ cartpage }) => {
    await test.step("Verify that add prod and increase the qnty", async () => {
      await cartpage.choose_prod_frm_drpdwn(cartData.product4);
      await cartpage.click_Add_Prd_Btn();
    });
    await test.step("Increase the qnty of the prod", async () => {
      await cartpage.increase_prdt_qnty(cartData.product4);
      await expect(cartpage.quantity(cartData.product4)).toHaveText("2");

      await cartpage.view_prdt(cartData.product4);
      await expect(cartpage.view_popup()).toBeVisible();
      await expect(
        cartpage.view_popup_quantity(cartData.product4),
      ).toContainText("2");
      await cartpage.close_view_popup_btn(cartData.product4);
    });

    await test.step("Decrease the qnty of the prod", async () => {
      await cartpage.decrease_prdt_qnty(cartData.product4);
      await expect(cartpage.quantity(cartData.product4)).toHaveText("1");
      await cartpage.view_prdt(cartData.product4);
      await expect(
        cartpage.view_popup_quantity(cartData.product4),
      ).toContainText("1");
      await cartpage.close_view_popup_btn(cartData.product4);
    });
  });
});
