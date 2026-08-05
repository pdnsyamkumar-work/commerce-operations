import { Page, Locator } from "@playwright/test";
import { ButtonComponent } from "../components/button.component";
import { TextFieldComponent } from "../components/text-field.component";
import { DropdownComponent } from "../components/dropdown.component";
import { FileUploadComponent } from "../components/fileupload.component";
// import { ErrorComponent } from "../components/Error.component";

export class BasePage {
  readonly button: ButtonComponent;
  readonly field: TextFieldComponent;
  readonly dropdown: DropdownComponent;
  readonly uploadfile: FileUploadComponent;
  // readonly error: ErrorComponent;

  constructor(readonly page: Page) {
    this.button = new ButtonComponent(page);
    this.field = new TextFieldComponent(page);
    this.dropdown = new DropdownComponent(page);
    this.uploadfile = new FileUploadComponent(page);
    // this.error = new ErrorComponent(page);
  }

  getNavItem = (itemName: string) =>
    this.page.getByTestId(`nav-item-${itemName}`);

  async goto(url: string) {
    await this.page.goto(url);
  }
async launchWeb(){
  await this.page.goto("http://localhost:3000/");
}
  async clickElement(locator: Locator) {
    await locator.click();
  }

  async fillField(locator: Locator, value: string) {
    await locator.fill(value);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle");
  }
  async setFiles(locator: Locator, files: string[]) {
    await locator.setInputFiles(files);
  }
  async uploadFile(locator: Locator, file: string | string[]): Promise<void> {
    const [upload] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      locator.click(),
    ]);
    await upload.setFiles(file);
  }

  async selectDropdownOption(
    dropdown: Locator,
    optionText: string,
  ): Promise<void> {
    await dropdown.selectOption({ label: optionText });
  }

  async selectCustomDropdownOption(
    dropdown: Locator,
    optionText: string,
  ): Promise<void> {
    await dropdown.click();

    await this.page.getByTestId(`dropdown-option-${optionText}`).click();
  }
}
