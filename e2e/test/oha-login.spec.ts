import { test } from "@playwright/test";

import { LoginPage } from "../Pages/login-page"; //Importing your POM class. This allows: reusable methods  ,reusable locators

test("OHA Login", async ({ page }) => {
  //Creating test case named: OHA Login

  const loginPage = new LoginPage(page); //Creating Object  , This creates object of class. Use everything inside LoginPage class

  await page.goto(
    "https://auth-uat-v2.onetechsolution.co.in/login?client_id=39543dcb-b7f3-4f55-a799-0ee206c23e19&redirect_uri=https://admin-uat-v2.onetechsolution.co.in/auth/callback",
  );

  await loginPage.enterEmail("bhargav.v@caw.tech");

  await loginPage.clickLogin();

  await loginPage.enterOTP("2121");

  await loginPage.clickContinue();

  await loginPage.sidenavpage();

  await loginPage.addnewclient();
});
