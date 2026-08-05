import { Page, Locator } from "@playwright/test";

export class TextFieldComponent {
  constructor(private readonly page: Page) { }

  // FEEDBACK : use enums as inputs instead of strings

  getInputFiled = (labelName: string): Locator => {
    return this.page.getByTestId(`input-field-${labelName}`);
  };
}
