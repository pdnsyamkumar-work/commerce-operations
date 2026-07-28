import { Page } from "@playwright/test";

export class BasePage {
  protected page: Page;

  async navigate(url: string) {
    await this.page.goto(url);
  }
  constructor(page: Page) {
    this.page = page;
  }
  readonly getEmailAddressTextField = () =>
    this.page.getByRole("textbox", { name: "email" });
  readonly getPasswordTextField = () => this.page.getByLabel("Password *");
  readonly getSignInButton = () => this.page.getByTestId("SignIn button");
  readonly getSignUp = () => this.page.getByRole("button", { name: "Sign up" });

  async enterEmail(email: string) {
    await this.getEmailAddressTextField().fill(email);
  }
  async enterPassword(password: string) {
    await this.getPasswordTextField().fill(password);
  }
}
