import { Locator, Page } from "@playwright/test";
import { Buttons } from "../enums/component_enums/labes_enums";

export class ButtonComponent {
  constructor(private readonly page: Page) {}

  // FEEDBACK : use enums as inputs instead of strings
  getButton(buttonName: Buttons): Locator {
    return this.page.getByTestId(`btn-field-${buttonName}`);
  }
}
