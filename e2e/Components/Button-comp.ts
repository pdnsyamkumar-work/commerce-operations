import { Locator, Page } from "@playwright/test";

export class ButtonComponent {
  constructor(private readonly page: Page) {}

  // FEEDBACK : use enums as inputs instead of strings
  getButton(buttonName: string): Locator {
    return this.page.getByTestId(`btn-field-${buttonName}`);
  }
}
