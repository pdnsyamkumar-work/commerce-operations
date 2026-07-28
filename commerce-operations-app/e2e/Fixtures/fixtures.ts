import{test as base,expect} from '@playwright/test';
import { SignInPage } from '../pageObjects/signInPage';
import { SignUpPage } from '../pageObjects/signUpPage';
import { forgetPassword } from '../pageObjects/forgetPassword';
import { createProduct } from '../pageObjects/createProduct';
import { cartPage } from '../pageObjects/CartPage';

type MyFixtures = {
     signInPage:SignInPage;
     signUpPage:SignUpPage;
     forgetPasswordPage:forgetPassword;
     createProductPage:createProduct;
     addToCartPage:cartPage;
};

export const test = base.extend<MyFixtures>({
    signInPage:async({page},use)=>{
        const signInPage=new SignInPage(page);
        await signInPage.navigate("http://localhost:3000/");
        await use(new SignInPage(page));
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
    addToCartPage:async({page},use)=>{
        await use(new cartPage(page));
    }
});
export{expect}from '@playwright/test';