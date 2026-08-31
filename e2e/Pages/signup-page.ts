import { Page } from "@playwright/test";
import { signupdata } from "../utils/interfaces/signup.interface";
export class SignupPage {
  // FEEDBACK: Page classes should inherit from base page class
  // FEEDBACK : Constructor is not required since we are inheriting all from base page class
  constructor(private page: Page) {}

  fullname = this.page.getByRole("textbox", { name: "Full name *" });
  workemail = this.page.getByRole("textbox", { name: "Work email *" });
  companyname = this.page.getByRole("textbox", {
    name: "Store or company name *",
  });
  password = this.page.getByRole("textbox", { name: /Password \*/ });
  confirmpassword = this.page.getByRole("textbox", {
    name: /Confirm password \*/,
  });
  signupTab = this.page.getByRole("button", { name: /sign up/i });
  createAccountBtn = this.page.getByRole("button", { name: /create account/i });

  async openSignup() {
    await this.signupTab.click();
  }

  async fillSignupForm(data: signupdata) {
    await this.fullname.fill(data.fullname);
    await this.workemail.fill(data.workemail);
    await this.companyname.fill(data.companyname);
    await this.password.fill(data.password);
    await this.confirmpassword.fill(data.confirmpassword);
  }

  async createaccount() {
    await this.createAccountBtn.click();
  }
  async waitforcreateaccountresponse() {
    return await this.page.waitForResponse(
      (response) =>
        response.url().includes("auth/signup") &&
        response.request().method() === "POST",
    );
  }
}
