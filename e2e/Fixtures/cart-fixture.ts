import { test as baseTest, expect } from "@playwright/test";
import carts from "../Pages/cart-page";

type MyFixtures = {

    cartpage: carts;

};

export const test = baseTest.extend<MyFixtures>({

    cartpage: async ({ page }, use) => {

        const cartpage = new carts(page);

        await cartpage.login_navig_toCarts();

        await use(cartpage);

    },

});

export { expect };