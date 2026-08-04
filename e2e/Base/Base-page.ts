//This is the Parent class

import { Page } from "@playwright/test";
import { TextFieldComponent } from "../Components/Text-Field-comp";
import { ButtonComponent } from "../Components/Button-comp";
import { Buttons } from "../enums/component_enums/labes_enums";
import { ErrorMessage } from "../Components/Error_message_comp";
import { UploadFileComp } from "../Components/Upload-comp";

export class BasePage {
  protected readonly page: Page;
  protected readonly baseUrl = "http://localhost:3000/";

  readonly textfield: TextFieldComponent;
  readonly button: ButtonComponent;
  readonly errormessage: ErrorMessage;
  readonly uploadfile: UploadFileComp;

  constructor(page: Page) {
    this.page = page;

    //inputfiled component
    this.textfield = new TextFieldComponent(page);

    this.button = new ButtonComponent(page);

    this.errormessage = new ErrorMessage(page);

    this.uploadfile = new UploadFileComp(page);
  }

  async navigate() {
    await this.page.goto(this.baseUrl);
  }

  async clickOnSignIn() {
    await this.button.getButton(Buttons.SIGN_IN).click();
  }

  async signUpClick() {
    await this.button.getButton(Buttons.SIGN_UP).click();
  }

  async logout() {
    await this.button.getButton(Buttons.PROFILE_DROPDOWN).click();
    await this.button.getButton(Buttons.SIGN_OUT).click();
    await this.button.getButton(Buttons.SIGN_IN).waitFor({ state: "visible" });
  }
}
