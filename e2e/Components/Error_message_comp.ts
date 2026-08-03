import { Page, Locator } from "@playwright/test";

export class ErrorMessage {
  constructor(private readonly page: Page) {}

  getErrorMessage = (errorField: string): Locator => {
    return this.page.getByTestId(`error-field-${errorField}`);
  };
}
