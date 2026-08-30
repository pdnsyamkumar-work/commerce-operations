import { Page, Locator } from "@playwright/test";
import { ButtonComponent } from "../components/buttons.components";
import { TextFieldComponent } from "../components/textfield.components";
import { DropdownComponent } from "../components/dropdown.components";
import { FileUploadComponent } from "../components/fileupload.components";
import { ErrorMessageComponet } from "../components/inlineError.components";

export class BasePage {
  readonly button: ButtonComponent;
  readonly field: TextFieldComponent;
  readonly dropdown: DropdownComponent;
  readonly uploadfile: FileUploadComponent;
  readonly errormessage:ErrorMessageComponet;
  constructor(readonly page: Page) {
    this.button = new ButtonComponent(page);
    this.field = new TextFieldComponent(page);
    this.dropdown = new DropdownComponent(page);
    this.uploadfile = new FileUploadComponent(page);
    this.errormessage=new ErrorMessageComponet(page);
  }

  // Common navigation
  getNavItem = (itemName: string): Locator => {
    return this.page.getByTestId(`nav-item-${itemName}`);
  };

  async goto(url: string) {
    await this.page.goto(url);
  }

  async launchWeb() {
    await this.page.goto("http://localhost:3000/");
  }

  // Common click
  async clickElement(locator: Locator) {
    await locator.click();
  }

  // Common field action
  async fillField(locator: Locator, value: string) {
    await locator.fill(value);
  }

  // Common file upload
  async setFiles(locator: Locator, files: string[]) {
    await locator.setInputFiles(files);
  }

  async uploadFile(
    locator: Locator,
    file: string | string[]
  ): Promise<void> {
    const [upload] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      locator.click(),
    ]);

    await upload.setFiles(file);
  }

  // Common dropdown
  async selectDropdownOption(
    dropdown: Locator,
    optionText: string
  ): Promise<void> {
    await dropdown.selectOption({ label: optionText });
  }

  // Custom dropdown
  async selectCustomDropdownOption(
    dropdown: Locator,
    optionText: string
  ): Promise<void> {
    await dropdown.click();

    await this.page
      .getByTestId(`dropdown-option-${optionText}`)
      .click();
  }

  // Wait for page to finish loading
  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle");
  }

  // Common API wait
  async waitForResponse(
    url: string,
    method: string = "POST"
  ) {
    return await this.page.waitForResponse(
      (response) =>
        response.url().includes(url) &&
        response.request().method() === method
    );
  }

  // Common scrolling
  async scrollIntoView(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }
}