import { test, expect } from "@playwright/test";
import sign_up from "../Pages/Sign_up_page";
import { testData } from "../testdata/sign-up-data";
import { Buttons } from "../enums/component_enums/labes_enums";

test.describe("Sign Up Module", () => {
  let signup: sign_up;

  test.beforeEach(async ({ page }) => {
    signup = new sign_up(page);
  });

  test("Verify user can create an account successfully", async () => {
    await signup.multisignup([testData.user1]);
    await expect(
      signup.button.getButton(Buttons.PROFILE_DROPDOWN),
    ).toBeVisible();
    await signup.logout();
  });

  test("Verify multiple users can create accounts successfully", async () => {
    const users = [testData.user2, testData.user3, testData.user4];
    for (const user of users) {
      await signup.multisignup([user]);
      await expect(
        signup.button.getButton(Buttons.PROFILE_DROPDOWN),
      ).toBeVisible();
      await signup.logout();
    }
  });

  test("Verify system displays validation message when mandatory fields are blank", async () => {
    const users = [
      testData.invalidUser1,
      testData.invalidUser2,
      testData.invalidUser4,
      testData.invalidUser5,
    ];

    for (const user of users) {
      await signup.navigate();
      await signup.clickSignUpTab();
      await signup.fillSignupDetails(user);
      await signup.clickCreateAccount();

      const errorLocator = await signup.getExpectedErrorLocator(user);

      expect(errorLocator).not.toBeNull();
      await expect(errorLocator!).toBeVisible();
    }
  });

  test("Verify system displays user already exists message", async () => {
    await signup.multisignup([testData.user1]);
  });
});
