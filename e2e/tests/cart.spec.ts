import { test, expect } from "@playwright/test";
import { SigninPage } from "../pages/signinPage";
import { CartPage } from "../pages/CartPage";
import { userSigninData } from "../testdata/userData";
import { createProduct } from "../pages/createProduct";
import { productData } from "../testdata/userData";
import {cartData} from "../testdata/userData";

let cart: CartPage;
let login: SigninPage;
test.describe(" cart page", () => {
  test.beforeEach(async ({ page }) => {
    cart = new CartPage(page);
    login = new SigninPage(page);
  
    await page.goto("http://localhost:3000/");
    await login.gotosignin();
    await login.signin(userSigninData.validData);
    await login.clicksignIn();
    await cart.clickOnCartIcon();

  });
  test("should add selected product to cart", async ({ page }) => {

    await cart.AddItemToCart(cartData.product1.itemName);
    
    await expect(cart.getDropdownField()).toContainText(
      cartData.product1.itemName
    );
    await expect(cart.getProductName(cartData.product1.itemName)).toBeVisible();
    await expect(cart.getProductPrice(cartData.product1.itemName)).toContainText( cartData.product1.price);
  
    
  });
  test("should increase product quantity in cart", async ({ page }) => {
   
    await cart.AddItemToCart(cartData.product1.itemName);
    const initialCount = Number(await cart.getProductQuantity(cartData.product1.itemName).textContent());
    await cart.updateQty(cartData.product1.itemName);
    await cart.clickElement(cart.getViewButton(cartData.product1.itemName));
    await expect(cart.getCartCount()).toContainText(String(initialCount + 1));
  });
  test("should remove product from cart", async ({ page }) => {
    await cart.AddItemToCart(cartData.product2.itemName); 
    await cart.removeItem(cartData.product2.itemName);
    await expect(cart.getProductName(cartData.product2.itemName)).not.toBeVisible();
  });
});
