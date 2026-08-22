import { test as base, expect } from "@playwright/test";
import { SigninPage } from "../pages/signinPage";
import { createProduct } from "../pages/createProduct";
import { CartPage } from "../pages/CartPage";
import { ForgotPage } from "../pages/forgotPage";
import { SignupPage } from "../pages/signupPage";
import { createProductData } from "../testdata/create-product.testdata";
import { createSignupTestdata } from "../testdata/signup.testdata";
import { createSigninTestdata } from "../testdata/signin.testdata";
import { createForgotPasswordTestdata } from "../testdata/forgot.testdata";
type MyFixtures = {
  signinPage: SigninPage;
  signedInPage: SigninPage;
  products: createProduct;
  cart: CartPage;
  forgot: ForgotPage;
  signup: SignupPage;
  createProductData: typeof createProductData;
  createSignupTestdata: typeof createSignupTestdata;
  createSigninTestdata: typeof createSigninTestdata;
  createForgotTestdata: typeof createForgotPasswordTestdata;
};
export const test = base.extend<MyFixtures>({
  signinPage: async ({ page }, use) => {
    const signinPage = new SigninPage(page);
    await signinPage.launchWeb();
    await signinPage.gotosignin();
    await use(signinPage);
  },
  signedInPage: async ({ page }, use) => {
    const signedInPage = new SigninPage(page);
    await signedInPage.goto("http://localhost:3000/");
    await signedInPage.gotosignin();
    await signedInPage.signin(createSigninTestdata());
    await signedInPage.clicksignIn();
    await expect(signedInPage.getDashboardHeading()).toBeVisible();
    await use(signedInPage);
  },
  products: async ({ signedInPage }, use) => {
    const products = new createProduct(signedInPage.page);
    await products.navigateToProductsPage();
    await use(products);
  },
  cart: async ({ signedInPage }, use) => {
    const cart = new CartPage(signedInPage.page);
    await use(cart);
  },
  forgot: async ({ page }, use) => {
    const forgot = new ForgotPage(page);
    await forgot.goto("http://localhost:3000/");
    await forgot.gotoforgotPassword();
    await use(forgot);
  },
  signup: async ({ page }, use) => {
    const signup = new SignupPage(page);
    await signup.goto("http://localhost:3000/");
    await signup.gotosignup();
    await use(signup);
  },
  createProductData: async ({}, use) => {
    await use(createProductData);
  },
  createSignupTestdata: async ({}, use) => {
    await use(createSignupTestdata);
  },
  createSigninTestdata: async ({}, use) => {
    await use(createSigninTestdata);
  },
  createForgotTestdata: async ({}, use) => {
    await use(createForgotPasswordTestdata);
  },
});

export { expect } from "@playwright/test";
