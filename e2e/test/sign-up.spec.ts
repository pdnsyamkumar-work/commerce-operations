import { test } from "@playwright/test";
import sign_up from "../Pages/Sign_up_page";
import { testData } from "../testdata/sign-up-data";

test.describe("Sign Up Module", () => {
  let signup: sign_up;

  test.beforeEach(async ({ page }) => {
    signup = new sign_up(page);
  });

  test("Verify user can create an account successfully", async () => {
    await signup.multisignup([testData.user1]);
  });

  test("Verify multiple users can create accounts successfully", async () => {
    await signup.multisignup([testData.user2, testData.user3, testData.user4]);
  });

  test("Verify system displays validation message when mandatory fields are blank", async () => {
    await signup.multisignup([
      testData.invalidUser1,
      testData.invalidUser2,
      testData.invalidUser4,
      testData.invalidUser5,
    ]);
  });

  test("Verify system displays user already exists message", async () => {
    await signup.multisignup([testData.user1]);
  });
});
