import { Page, Locator } from "@playwright/test";
import { signinData } from "../interfaces/userData";
import { BasePage } from "./basePage";
import { Buttons, MenuItems } from "../enums/component-enum/buttons.enums";
import { TextField } from "../enums/component-enum/text-field.enum";
import { ErrorField } from "../enums/component-enum/error.enum";
export class SigninPage extends BasePage {
 
  constructor(page: Page) {
    super(page);
  
  }
  getInvalidCredentialsError(): Locator {
    return this.page.getByTestId("form-error");
  }
  getSigninLink(): Locator {
    return this.button.getButton(Buttons.SIGNIN_lINK);
  }
  getSigninEmailTextbox(): Locator {
    return this.field.getInputField(TextField.EMAIL_ADDRESS);
  }
  getPasswordTextbox(): Locator {
    return this.field.getInputField(TextField.PASSWORD);
  }
  getSigninBtn(): Locator {
    return this.button.getButton(Buttons.SIGNIN_BUTTON);
  }
  getDashboardHeading(): Locator {
    return this.button.getMenuItem(MenuItems.DASHBOARD);
  }
  getEmailError(): Locator {
    return this.page.getByTestId("inline-error");
  }

  async gotosignin() {
    await this.button.getButton(Buttons.SIGNIN_lINK).click();
  }
  async signin(user: signinData) {
    await this.field.getInputField(TextField.EMAIL_ADDRESS).fill(user.email);
    await this.field.getInputField(TextField.PASSWORD).fill(user.password);
    // await this.fillField(this.getSigninEmailTextbox(), user.email);
    // await this.fillField(this.getPasswordTextbox(), user.password);
  }
  async clicksignIn() {
    await this.button.getButton(Buttons.SIGNIN_BUTTON).click();
    // await this.clickElement(this.getSigninBtn());
  }
}
