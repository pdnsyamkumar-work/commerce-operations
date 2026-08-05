import { Locator, Page } from "@playwright/test";
import { UploadFileComp } from "../enums/component_enums/labes_enums";

export class UploadFileCompent {
  constructor(private readonly page: Page) { }

  // FEEDBACK : use enums as inputs instead of strings

  getUploadFile(UploadFile: UploadFileComp): Locator {
    return this.page.getByTestId(`upload-field-${UploadFile}`);
  }
}
