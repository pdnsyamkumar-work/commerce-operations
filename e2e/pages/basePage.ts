import { Page, Locator } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getNavItem = (itemName: string) => this.page.getByTestId(`nav-item-${itemName}`);

  async goto(url: string) {
    await this.page.goto(url);
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
