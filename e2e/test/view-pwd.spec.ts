import { test, expect, Locator } from "@playwright/test";
import { login_data } from "../testdata/login-data";
import sign_in from "../Pages/sign-in-page";

test("view password in test", async ({ page }) => {
  const signin = new sign_in(page);

  for (const data of login_data) {
    await page.goto("http://localhost:3000/");

    await signin.email_address(data.email);
    await signin.password(data.pwd);

    await signin.view_pswd();
    const actualPwd = await signin.getPassword();

    if (actualPwd === data.expectedPwd) {
      console.log("True");
    } else {
      console.log("False");
    }

    expect(actualPwd).toBe(data.pwd);

    await signin.clicksigin();
    if (data.expected == "success") {
      await signin.clickdrp();
      await signin.logout();
    } else {
      await expect(
        page.locator("//p[text()='Invalid email or password.']"),
      ).toBeVisible();
    }
  }
});
