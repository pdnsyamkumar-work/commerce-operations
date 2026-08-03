import { Page } from "@playwright/test";
import { Labels } from "../enums/labels";
import { Buttons } from "../enums/buttons";
import { TextFieldsComponents } from "../components/textFiledComponents";
import { Button } from "../components/buttonComponents";

export class BasePage {
  protected page: Page;
  readonly textField:TextFieldsComponents;
  readonly button:Button;

  constructor(page: Page) {
    this.page = page;
    this.textField=new TextFieldsComponents(page);
    this.button=new Button(page);
  }

  async navigate(url: string) {
    await this.page.goto(url);
  }
  async enterEmail(email: string) {
    await this.textField.getInputField(Labels.EMAIL_ADDRESS).fill(email);
  }
  async enterPassword(password: string) {
    await this.textField.getInputField(Labels.PASSWORD).fill(password);
  }
  async clickOnSignIn() {
    await this.button.getButton(Buttons.SIGN_IN_BUTTON).click();
  }
}
