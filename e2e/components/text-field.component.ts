import { Locator, Page } from "@playwright/test";
import { TextField } from "../enums/component-enum/text-field.enum";
export class TextFieldComponent {
  constructor(readonly page: Page) {}
  readonly getInputField = (textAreaName: TextField): Locator => {
    return this.page.getByTestId(`text-field-${textAreaName}`);
  };
}
