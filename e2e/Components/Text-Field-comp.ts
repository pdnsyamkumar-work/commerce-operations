import { Page, Locator } from "@playwright/test";
import { TextFiled } from "../enums/component_enums/text_field_enums";

export class TextFieldComponent {
  constructor(private readonly page: Page) { }

  // FEEDBACK : use enums as inputs instead of strings

  getInputFiled = (labelName: TextFiled): Locator => {
    return this.page.getByTestId(`input-field-${labelName}`);
  };
}
