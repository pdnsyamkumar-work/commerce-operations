import { Locator, Page } from "@playwright/test";
import { FileUpload } from "../enums/component-enum/fileupload.enum";
export class FileUploadComponent {
  constructor(readonly page: Page) {}
  readonly getFileUploadButton = (buttonName: FileUpload): Locator => {
    return this.page.getByTestId(`button-${buttonName}`);
  };
}
