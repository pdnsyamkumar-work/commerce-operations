import { test as base, expect } from "@playwright/test";
import { SignInPage } from "../pageobject/signin";
import { SignupPage } from "../pageobject/signup";
import { ForgotPasswordPage } from "../pageobject/fogetpassword";
import { CreateProductPage } from "../pageobject/createproduct";
import { CartPage } from "../pageobject/cart";

type MyFixtures = {
  signinPage: SignInPage;
  signUpPage: SignupPage;
  forgotPasswordPage: ForgotPasswordPage;
  createProductPage: CreateProductPage;
  cartPage: CartPage;
};

export const test = base.extend<MyFixtures>({
  signinPage: async ({ page }, use) => {
    const signinPage = new SignInPage(page);
    await signinPage.navigate("http://localhost:3000/");
    await use(signinPage);
  },

  signUpPage: async ({ page }, use) => {
    const signUpPage = new SignupPage(page);
    await signUpPage.navigate("http://localhost:3000/");
    await use(signUpPage);
  },

  forgotPasswordPage: async ({ page }, use) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.navigate("http://localhost:3000/");
    await use(forgotPasswordPage);
  },

  createProductPage: async ({ page }, use) => {
  const signinPage = new SignInPage(page);
  const createProductPage = new CreateProductPage(page);

  await signinPage.navigate("http://localhost:3000/");
  await signinPage.login(
    "admin@commerce.test",
    "Commerce@123"
  );

  await createProductPage.goToProducts();

  await use(createProductPage);
},

  cartPage: async ({ page }, use) => {
  const signinPage = new SignInPage(page);
  const cartPage = new CartPage(page);

  await signinPage.navigate("http://localhost:3000/");

  await signinPage.login(
    "admin@commerce.test",
    "Commerce@123"
  );

  await cartPage.openCart();

  await use(cartPage);
},
  
});

export { expect } from "@playwright/test";