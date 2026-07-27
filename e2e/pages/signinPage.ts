import { Page, Locator } from "@playwright/test";
import { signinData } from "../interfaces/userData";
import { BasePage } from "./basePage";
export class SigninPage extends BasePage {
  readonly invalidCredentialsError: Locator;

  constructor(page: Page) {
    super(page);
    this.invalidCredentialsError = page.getByText("Invalid email or password.");
  }
  getSigninLink(): Locator {
    return this.page.getByTestId("link-signin");
  }
  getSigninEmailTextbox(): Locator {
    return this.page.getByTestId("input-field-signin-email");
  }
  getPasswordTextbox(): Locator {
    return this.page.getByTestId("input-field-signin-password");
  }
  getSigninBtn(): Locator {
    return this.page.getByTestId("button-signin");
  }
  getDashboardHeading(): Locator {
    return this.page.getByTestId("nav-item-Dashboard");
  }
  getEmailError(): Locator {
    return this.page.getByTestId("signin-email-error");
  }

  async gotosignin() {
    await this.clickElement(this.getSigninLink());
  }
  async signin(user: signinData) {
    await this.fillField(this.getSigninEmailTextbox(), user.email);
    await this.fillField(this.getPasswordTextbox(), user.password);
  }
  async clicksignIn() {
    await this.clickElement(this.getSigninBtn());
  }
}
