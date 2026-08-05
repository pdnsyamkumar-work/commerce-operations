import { Locator, Page } from "@playwright/test";

export class UploadFileComp {
  constructor(private readonly page: Page) { }

  // FEEDBACK : use enums as inputs instead of strings

  getUploadFile(UploadFile: string): Locator {
    return this.page.getByTestId(`upload-field-${UploadFile}`);
  }
}
