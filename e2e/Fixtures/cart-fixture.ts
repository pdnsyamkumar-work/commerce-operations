import { test as baseTest, expect } from "@playwright/test";
import carts from "../Pages/cart-page";
import SignInPage from "../Pages/sign-in-page";
import SignUp from "../Pages/Sign_up_page";

type MyFixtures = {
  cartpage: carts;
  sign_in : SignInPage;
  sign_up:SignUp

};

export const test = baseTest.extend<MyFixtures>({
  cartpage: async ({ page }, use) => {
    const cartpage = new carts(page);
    await cartpage.login_navig_toCarts();
    await use(cartpage);

  },

   sign_in: async ({ page }, use) => {
    const signIn = new SignInPage(page);
    await use(signIn);
  },
});



export { expect };
