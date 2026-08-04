import { Page, Locator } from "@playwright/test";
import { ErrorField } from "../enums/component-enum/error.enum";
export class ErrorComponent {
  constructor(readonly page: Page) {}

  getError(field: ErrorField): Locator {
    return this.page.getByTestId(`error-${field}`);
  }
}