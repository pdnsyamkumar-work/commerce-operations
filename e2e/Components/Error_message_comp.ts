import { Page, Locator } from "@playwright/test";
import { ErrorField } from "../enums/component_enums/Error_enums";

export class ErrorMessage {
  constructor(private readonly page: Page) { }

  // FEEDBACK : use enums as inputs instead of strings

  getErrorMessage = (errorField:ErrorField): Locator => {
    return this.page.getByTestId(`error-field-${errorField}`);
  };
}
