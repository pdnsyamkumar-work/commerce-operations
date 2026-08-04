import { Locator, Page } from "@playwright/test";

export class DropDownComp {
  constructor(private readonly page: Page) {}

  getDropdown(Dropdown: string): Locator {
    return this.page.getByTestId(`dropdown-field-${Dropdown}`);
  }
}
