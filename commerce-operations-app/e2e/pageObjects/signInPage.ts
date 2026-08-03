import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";


export class SignInPage extends BasePage {
  
  constructor(page: Page) {
    super(page);
  }
  readonly getTitle = () => this.page.getByTestId("Commerce Admin Title");
  readonly getInvalidEmailPasswordError = () => this.page.getByText("Invalid email or password.");
  readonly getEmailRequiredError = () => this.page.getByTestId("Email-Error");
  readonly getCredentialsError = () => this.page.getByText("Fix the highlighted email field before signing in.");

  async waitForLoginApi() {
    return await this.page.waitForResponse(
      (response) =>
        response.url().includes("/login") &&
        response.request().method() === "POST",
    );
  }
  
}
