/*

1. What is Constructor?

A constructor is a special method inside a class.

It runs automatically when object is created.

Syntax:
constructor() {}

cWhen object is created ->  const loginPage = new LoginPage(page); -> this constructor automatically runs.constructor(private page: Page) {}

Why private Keyword?
constructor(private page: Page)
private
means:
variable accessible only inside class
Outside class NOT allowed.




WHY THIS FILE IS NEEDED
locators
reusable functions
*/
import { Page } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {} //Constructor initializes page object.  Equivalent to: this.page = page;

  // LOCATORS

  emailInput = () => this.page.getByRole("textbox", { name: "Email" });

  loginButton = () => this.page.getByRole("button", { name: "Continue" });

  otpInputs = () => this.page.locator("#otpForm").getByRole("textbox");

  continueButton = () => this.page.getByRole("button", { name: "Continue" });

  clientwrkspace = () => this.page.getByText("Client Workspace");

  addnewclientButton = () => this.page.getByText("Add New Client");

  // METHODS

  async enterEmail(email: string) {
    await this.emailInput().fill(email);
  }

  async clickLogin() {
    await this.loginButton().click();
  }

  async enterOTP(otp: string) {
    for (let i = 0; i < otp.length; i++) {
      await this.otpInputs().nth(i).fill(otp[i]);
    }
  }

  async clickContinue() {
    await this.continueButton().click();
  }

  async sidenavpage() {
    await this.clientwrkspace().click();
  }

  async addnewclient() {
    await this.addnewclientButton().click();
  }
}
