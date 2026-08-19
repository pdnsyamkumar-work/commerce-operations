import { test, expect } from "@playwright/test";
import { SignInPage } from "../pageobject/signin";
import { signinScenarios } from "./testData/signinScenarios";

test.describe("Sign In Page", () => {
  let signInPage: SignInPage;

  test.beforeEach(async ({ page }) => {
    signInPage = new SignInPage(page);

    await signInPage.navigate("http://localhost:3000/");
  });

  test("User should successfully sign in with valid credentials", async ({ page }) => {
    await test.step("User should successfully sign in with valid credentials", async () => {
      const user = signinScenarios.success;

       await signInPage.enterEmail(user.email);
  await signInPage.enterPassword(user.password);

  const responsePromise = signInPage.waitForLoginApi();

  await signInPage.clickOnSignIn();

  const response = await responsePromise;

  expect(response.status()).toBe(200);

      await expect(page).toHaveTitle("Commerce Operations");
    });
  });

  test("User should see error message for invalid email", async ({ page }) => {
    const user = signinScenarios.Invalid_Email;

    await signInPage.login(user.email, user.password);

    await expect(
        page.getByText("Invalid email or password.", { exact: true })
    ).toBeVisible();
});

test("User should see error message for invalid password", async ({ page }) => {
    const user = signinScenarios.Invalid_Password;

    await signInPage.login(user.email, user.password);

    await expect(
        page.getByText("Invalid email or password.", { exact: true })
    ).toBeVisible();
});

test("User should see validation message when email is empty", async ({ page }) => {
   const user =signinScenarios.Empty_Email;
   await signInPage.login(user.email, user.password);
    await expect(
        page.getByText("Fix the highlighted email field before signing in.", { exact: true })
    ).toBeVisible();
});

/*test("User should see error message when password is empty", async ({ page }) => {
  await signInPage.enterEmail(signinScenarios.success.email);
  await signInPage.clickOnSignIn();

  await expect(
    page.getByText("Invalid email or password.", { exact: true })
  ).toBeVisible();
});*/
});