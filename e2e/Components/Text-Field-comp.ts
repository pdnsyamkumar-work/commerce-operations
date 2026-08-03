import { Page, Locator } from "@playwright/test";

export class TextFieldComponent {
  constructor(private readonly page: Page) {}

  getInputFiled = (labelName: string): Locator => {
    return this.page.getByTestId(`input-field-${labelName}`);
                                            
  };
}
