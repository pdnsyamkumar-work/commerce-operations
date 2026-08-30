import { Locator, Page } from "@playwright/test";

export class FileUploadComponent {
  constructor(readonly page: Page) {}

  async setFiles(locator: Locator, files: string[]) {
    await locator.setInputFiles(files);
  }

  async uploadFile(locator: Locator, file: string | string[]) {
    const [upload] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      locator.click(),
    ]);

    await upload.setFiles(file);
  }

  readonly getUpload = (uploadName: string): Locator => {
    return this.page.getByTestId(`upload-image-${uploadName}`);
  };
}