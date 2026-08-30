import { Locator, Page } from "@playwright/test";
import { ErrorFields } from "../enums/inlineErrors.enums";

export class ErrorMessageComponet{
  constructor(readonly page: Page) {}

 readonly getErrorMessage = (errorField: ErrorFields): Locator => {
  return this.page.getByTestId(`error message-${errorField}`);
};
}