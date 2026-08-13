import { test, expect } from "@playwright/test";
import { SigninPage } from "../Pages/signin-page";
import { signin } from "../utils/interfaces/signin.interface";
import { signin_data } from "../testdata/signin-data";

test.describe("Signin Tests", () => {
  test.beforeEach(async ({ page }) => {
    const sign_in = new SigninPage(page);
    await sign_in.navigate();
  });

  test("Verify user can login with the invalid details", async ({ page }) => {
    const login = new SigninPage(page);
    await login.filllogin(signin_data[0]);
    const responsePromise = login.waitforsigninresponse();
    await login.clickSigninButton();
    const response = await responsePromise;
    expect(response.status()).toBe(401);
  });

  test("Verify user can login with the valid details", async ({ page }) => {
    const login = new SigninPage(page);
    await login.filllogin(signin_data[1]);
    const responsePromise = login.waitforsigninresponse();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
  });

  test("Login with innvalid user", async ({ page }) => {
    const login = new SigninPage(page);
    await login.filllogin(signin_data[2]);
    const responsePromise = login.waitforsigninresponse();
    const response = await responsePromise;
    expect(response.status()).toBe(401);
    expect(page.getByText("Invalid email or password.")).toBeVisible;
  });

  test("Verify user can login withthe invalid email", async ({ page }) => {
    const login = new SigninPage(page);
    await login.filllogin(signin_data[3]);
    expect(page.getByText("Fix the highlighted email field before signing in."))
      .toBeVisible;
  });

  test("Verify user can login with the invalid password", async ({ page }) => {
    const login = new SigninPage(page);
    await login.filllogin(signin_data[4]);
    expect(page.getByText("Enter a valid email address.")).toBeVisible;
  });
});
