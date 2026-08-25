import {test as base}from "@playwright/test";
import { SignInPage } from "../pageObjects/signInPage";
import { SignUpPage } from "../pageObjects/signUpPage";
import { forgetPassword } from "../pageObjects/forgetPassword";
import { createProduct } from "../pageObjects/createProduct";
import { cartPage } from "../pageObjects/CartPage";


type MyFixtures = {
   signinPage: SignInPage;
   signUpPage: SignUpPage;
   forgetPasswordPage : forgetPassword;
   createProductPage : createProduct;
   cartPage: cartPage;
};

export const test=base.extend<MyFixtures>({
   signinPage:async({page},use)=>{
      const signinPage = new SignInPage(page);
      await signinPage.navigate("http://localhost:3000/");
      await use(signinPage);
   },

   signUpPage:async({page},use)=>{
      await use(new SignUpPage(page));
   },

   forgetPasswordPage:async({page},use)=>{
      await use(new forgetPassword(page));
   },

   createProductPage:async({page},use)=>{
      await use(new createProduct(page));
   },

   cartPage:async({page},use)=>{
      await use(new cartPage(page));
   },
   
});
