import { Locator, Page } from "@playwright/test";

export class ButtonComponent {
  constructor(private readonly page: Page) {}

  getButton(buttonName: string): Locator {
     return this.page.getByTestId(`btn-field-${buttonName}`)
  }
}