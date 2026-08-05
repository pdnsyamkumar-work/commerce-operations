//This is the Parent class

import { Page } from "@playwright/test";
import { TextFieldComponent } from "../Components/Text-Field-comp";
import { ButtonComponent } from "../Components/Button-comp";
import { Buttons } from "../enums/component_enums/labes_enums";
import { ErrorMessage } from "../Components/Error_message_comp";
import { UploadFileCompent } from "../Components/Upload-comp";
import { DropDownCompent } from "../Components/Dropdown-comp";



export class BasePage {
  protected readonly page: Page;
  protected readonly baseUrl = "http://localhost:3000/"; // FEEDBACK : Remove this and add in playwright.config.ts file

  readonly textfield: TextFieldComponent;
  readonly button: ButtonComponent;
  readonly errormessage: ErrorMessage;
  readonly uploadfile: UploadFileCompent;
  readonly dropdown: DropDownCompent;

  constructor(page: Page) {
    this.page = page;

    //inputfiled component
    this.textfield = new TextFieldComponent(page);

    this.button = new ButtonComponent(page);

    this.errormessage = new ErrorMessage(page);

    this.uploadfile = new UploadFileCompent(page);
    this.dropdown = new DropDownCompent(page);
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
