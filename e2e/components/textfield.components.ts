import { Locator, Page } from "@playwright/test";
import { TextField } from "../enums/text-field.enums";

export class TextFieldComponent {
  constructor(readonly page: Page) {}

  readonly getInputField = (textFieldName: TextField): Locator => {
    return this.page.getByTestId(`input-textfield-${textFieldName}`);
  };
}