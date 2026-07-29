import { Locator, Page } from "@playwright/test";
import { BasePage } from "../Base/Base-page";
import { SignInData } from "../utils/interfaces/sign_in.interface";
import { Labels } from "../enums/component_enums/labes_enums";

export default class SignInPage extends BasePage {
  //Signinpage inherits everthing inside Base Page

  readonly invalidMsg: Locator;

  constructor(page: Page) {
    super(page);

    this.invalidMsg = page.locator("//p[text()='Invalid email or password.']");
  }

  async fillSignInDetails(data: SignInData) {
    await this.textfield.getInputFiled(Labels.EMAIL_ADDRESS).fill(data.email);
    await this.textfield.getInputFiled(Labels.PASSWORD).fill(data.password);
  }

  async login(data: SignInData) {
    await this.fillSignInDetails(data);
    await this.clickOnSignIn();
  }
}
