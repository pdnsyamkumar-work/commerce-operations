import { Locator, Page } from "@playwright/test";

export class DropDownComp {
  constructor(private readonly page: Page) { }

  // FEEDBACK : use enums as inputs instead of strings

  getDropdown(Dropdown: string): Locator {
    return this.page.getByTestId(`dropdown-field-${Dropdown}`);
  }
}
