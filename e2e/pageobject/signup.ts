import { BasePage } from "./basepage";
import { Buttons } from "../enums/button.enums";
import { TextField } from "../enums/text-field.enums";

export class SignupPage extends BasePage {
  // Tabs
  readonly signUpTab = this.page.getByTestId("tab-sign up");

  // Form Fields
  readonly fullName = this.field.getInputField(TextField.FULLNAME);
  readonly workEmail = this.field.getInputField(TextField.WORK_EMAIL);
  readonly companyName = this.field.getInputField(TextField.COMPANY_NAME);
  readonly password = this.field.getInputField(TextField.PASSWORD).nth(0);
  readonly confirmPassword = this.field.getInputField(TextField.PASSWORD).nth(1);

  // Buttons
  readonly passwordViewBtn = this.button.getButton(Buttons.VIEW).nth(0);
  readonly confirmPasswordViewBtn = this.button.getButton(Buttons.VIEW).nth(1);
  readonly createAccountBtn = this.button.getButton(Buttons.CREATE_ACCOUNT);

  async waitForSignupApi() {
    return await this.waitForResponse("/signup");
  }

  async navigate(url: string) {
    await this.page.goto(url);
  }

  async clickSignUp() {
    await this.clickElement(this.signUpTab);
  }

  async enterFullName(name: string) {
    await this.fillField(this.fullName, name);
  }

  async enterWorkEmail(email: string) {
    await this.fillField(this.workEmail, email);
  }

  async enterCompanyName(company: string) {
    await this.fillField(this.companyName, company);
  }

  async enterPassword(password: string) {
    await this.fillField(this.password, password);
  }

  async enterConfirmPassword(confirmPassword: string) {
    await this.fillField(this.confirmPassword, confirmPassword);
  }

  async clickCreateAccount() {
    await this.clickElement(this.createAccountBtn);
  }

  async createAccount(
    name: string,
    email: string,
    company: string,
    password: string
  ) {
    await this.clickSignUp();
    await this.enterFullName(name);
    await this.enterWorkEmail(email);
    await this.enterCompanyName(company);
    await this.enterPassword(password);
    await this.enterConfirmPassword(password);
    await this.clickCreateAccount();
  }
}