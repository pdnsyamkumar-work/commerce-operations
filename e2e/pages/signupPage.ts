import { Page, Locator } from "@playwright/test";
import { signupData } from "../interfaces/userData";
import { BasePage } from "./basePage";
import { Buttons, MenuItems } from "../enums/component-enum/buttons.enums";
import { TextFieldComponent } from "../components/text-field.component";
import { TextField } from "../enums/component-enum/text-field.enum";

export class SignupPage extends BasePage {
    // FEEDBACK: Constructor is not required since this feature class inherited from base page class

  constructor(page: Page) {
    super(page);
  }
  getNameTextbox(): Locator {
    return this.field.getInputField(TextField.FULLNAME);
  }
  getSignupEmailTextbox(): Locator {
    return this.field.getInputField(TextField.WORKEMAIL);
  }
  getCompanyTextbox(): Locator {
    return this.field.getInputField(TextField.COMPANY);
  }
  getPasswordTextbox(): Locator {
    return this.field.getInputField(TextField.PASSWORD);
  }
  getConfirmPasswordTextbox(): Locator {
    return this.field.getInputField(TextField.CONFIRMPASSWORD);
  }
  getCreateBtn(): Locator {
    return this.button.getButton(Buttons.SIGNUP_BUTTON);
  }
  getSignupLink(): Locator {
    return this.button.getButton(Buttons.SIGNUP_LINK);
  }
  getEmailError(): Locator {
    return this.page.getByTestId("inline-error");
  }
  getDashboardHeading(): Locator {
    return this.button.getMenuItem(MenuItems.DASHBOARD);
  }

  getFullNameError(): Locator {
    return this.page.getByTestId("inline-error");
  }
  getCompanyError(): Locator {
    return this.page.getByTestId("inline-error");
  }
  getPasswordError(): Locator {
    return this.page.getByTestId("inline-error");
  }
  getCnfPasswordError(): Locator {
    return this.page.getByTestId("inline-error");
  }

  async gotosignup() {
    await this.button.getButton(Buttons.SIGNUP_LINK).click();
    // await this.clickElement(this.getSignupLink());
  }
  async signup(user: signupData) {
    await this.field.getInputField(TextField.FULLNAME).fill(user.fullName);
    await this.field.getInputField(TextField.WORKEMAIL).fill(user.email);
    await this.field.getInputField(TextField.COMPANY).fill(user.companyName);
    await this.field.getInputField(TextField.PASSWORD).fill(user.password);
    await this.field
      .getInputField(TextField.CONFIRMPASSWORD)
      .fill(user.confirmPassword);
    // await this.fillField(this.getNameTextbox(), user.fullName);
    // await this.fillField(this.getSignupEmailTextbox(), user.email);
    // await this.fillField(this.getCompanyTextbox(), user.companyName);
    // await this.fillField(this.getPasswordTextbox(), user.password);
    // await this.fillField(
    //   this.getConfirmPasswordTextbox(),
    //   user.confirmPassword,
    // );

    // await expect(this.this.pagegetByRole('button',{name:'Dashboard'})).toBeVisible();
  }
  async clickCreateBtn() {
    await this.button.getButton(Buttons.SIGNUP_BUTTON).click();
  }
}
