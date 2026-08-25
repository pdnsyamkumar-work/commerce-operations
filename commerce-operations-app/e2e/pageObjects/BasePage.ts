import { Page } from "@playwright/test";
import { Labels } from "../enums/labels";
import { Buttons } from "../enums/buttons";
import { TextFieldsComponents } from "../components/textFiledComponents";
import { Button } from "../components/buttonComponents";
import { errorMessages } from "../components/inLineErrorsComponents";
import { Dropdowns } from "../components/dropdownComponents";

export class BasePage {
  protected page: Page;
  readonly textField:TextFieldsComponents;
  readonly button:Button;
  readonly errorField:errorMessages;
  readonly dropdown:Dropdowns;

  constructor(page: Page) {
    this.page = page;
    this.textField=new TextFieldsComponents(page);
    this.button=new Button(page);
    this.errorField=new errorMessages(page);
    this.dropdown=new Dropdowns(page);
  }

  async navigate(url: string) {
    await this.page.goto(url);
  }
  
}
