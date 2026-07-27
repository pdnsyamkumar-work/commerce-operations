import { Page, Locator } from "@playwright/test";
import { signupData } from "../interfaces/userData";
import { BasePage } from "./basePage";

export class SignupPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  getNameTextbox(): Locator {
    return this.page.getByTestId("input-field-signup-fullname");
  }
  getSignupEmailTextbox(): Locator {
    return this.page.getByTestId("input-field-signup-work-email");
  }
  getCompanyTextbox(): Locator {
    return this.page.getByTestId("input-field-signup-company-name");
  }
  getPasswordTextbox(): Locator {
    return this.page.getByTestId("input-field-signup-password");
  }
  getConfirmPasswordTextbox(): Locator {
    return this.page.getByTestId("input-field-signup-confirm-password");
  }
  getCreateBtn(): Locator {
    return this.page.getByTestId("button-signup-create-account");
  }
  getSignupLink(): Locator {
    return this.page.getByTestId("link-signup");
  }
  getEmailError(): Locator {
    return this.page.getByTestId("signup-email-error");
  }
  getDashboardHeading(): Locator {
    return this.page.getByTestId("nav-item-Dashboard");
  }

  getFullNameError(): Locator {
    return this.page.getByTestId("signup-name-error");
  }
  getCompanyError(): Locator {
    return this.page.getByTestId("signup-store-error");
  }
  getPasswordError(): Locator {
    return this.page.getByTestId("signup-password-error");
  }
  getCnfPasswordError(): Locator {
    return this.page.getByTestId("signup-confirm-password-error");
  }

  async gotosignup() {
    await this.clickElement(this.getSignupLink());
  }
  async signup(user: signupData) {
    await this.fillField(this.getNameTextbox(), user.fullName);
    await this.fillField(this.getSignupEmailTextbox(), user.email);
    await this.fillField(this.getCompanyTextbox(), user.companyName);
    await this.fillField(this.getPasswordTextbox(), user.password);
    await this.fillField(
      this.getConfirmPasswordTextbox(),
      user.confirmPassword,
    );

    // await expect(this.this.pagegetByRole('button',{name:'Dashboard'})).toBeVisible();
  }
  async clickCreateBtn() {
    await this.clickElement(this.getCreateBtn());
  }
}
