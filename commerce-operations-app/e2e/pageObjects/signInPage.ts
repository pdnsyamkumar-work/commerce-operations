import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Labels } from "../enums/labels";
import { Buttons } from "../enums/buttons";

export class SignInPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  readonly getTitle = () => this.page.getByTestId("Commerce Admin Title");
  async waitForLoginApi() {
    return await this.page.waitForResponse(
      (response) =>
        response.url().includes("/login") &&
        response.request().method() === "POST",
    );
  }

  async fillLoginCredentials(email:string,password:string){
     await this.textField.getInputField(Labels.EMAIL_ADDRESS).fill(email);
     await this.textField.getInputField(Labels.SIGN_IN_PASSWORD).fill(password);
  }
  async clickOnSignInButton() {
    await this.button.getButton(Buttons.SIGN_IN_BUTTON).click();
  }
}
