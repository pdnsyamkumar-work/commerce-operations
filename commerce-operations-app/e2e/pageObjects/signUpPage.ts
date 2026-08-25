import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Buttons } from "../enums/buttons";
import { Labels } from "../enums/labels";

export class SignUpPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  readonly getCommerceTitle = () => this.page.getByTestId("Commerce Admin Title");

  async waitForsignUpAPI() {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes("/api/auth/signup") &&
        response.request().method() === "POST",
    );
  }
  async signUpClick() {
    await this.button.getButton(Buttons.SIGN_UP_NAV).click();
  }
  async fillTheForm(
    name: string,
    email: string,
    companyName: string,
    password: string,
    confirmPassword: string,
  ) {
    await this.textField.getInputField(Labels.FULL_NAME).fill(name);
    await this.textField.getInputField(Labels.WORK_EMAIL).fill(email);
    await this.textField.getInputField(Labels.COMPANY_NAME).fill(companyName);
    await this.textField.getInputField(Labels.SIGN_UP_PASSWORD).fill(password);
    await this.textField.getInputField(Labels.CONFIRM_PASSWORD).fill(confirmPassword);
  }
  
  async clickOnCreateAccount() {
    await this.button.getButton(Buttons.CREATE_ACCOUNT).click();
  }
 
}
