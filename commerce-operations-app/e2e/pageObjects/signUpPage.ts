import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SignUpPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  readonly getSignUpButton = () =>
    this.page.getByRole("button", { name: "Sign up" });
  readonly getFullNameFiled = () =>
    this.page.getByTestId("input-field-FullName");
  readonly getWorkEmail = () =>
    this.page.getByRole("textbox", { name: "email" });
  readonly getCompanyName = () =>
    this.page.locator("//form[@class='grid gap-4']/label[3]/input");
  readonly getPassword = () =>
    this.page.getByRole("textbox", { name: "password" }).first();
  readonly getConfirmPassword = () =>
    this.page.getByRole("textbox", { name: "Confirm password" }).last();
  readonly getCreateAccount = () =>
    this.page.getByRole("button", { name: "Create Account" });
  readonly getSignOutButton = () =>
    this.page.getByRole("button", { name: "Sign Out" });
  readonly getCommerceTitle = () => this.page.getByTestId("Commerce Admin Title");

  async waitForsignUpAPI() {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes("/api/auth/signup") &&
        response.request().method() === "POST",
    );
  }
  async signUpClick() {
    await this.getSignUpButton().click();
  }
  async fillTheForm(
    name: string,
    email: string,
    companyName: string,
    password: string,
    confirmPassword: string,
  ) {
    await this.getFullNameFiled().fill(name);
    await this.getWorkEmail().fill(email);
    await this.getCompanyName().fill(companyName);
    await this.getPassword().fill(password);
    await this.getConfirmPassword().fill(confirmPassword);
  }
  async clickOnCreateAccount() {
    await this.getCreateAccount().click();
  }
  async clickOnSignOutButton() {
    await this.getSignOutButton().click();
  }
}
