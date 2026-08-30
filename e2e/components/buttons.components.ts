import { Locator, Page } from "@playwright/test";
import { Buttons } from "../enums/button.enums";

export class ButtonComponent {
  constructor(readonly page: Page) {}

  readonly getButton = (buttonName: Buttons): Locator => {
    return this.page.getByTestId(`button-${buttonName}`);
  };
}