import { Locator, Page } from "@playwright/test";
import { DropDownComp } from "../enums/Drpdwn_enum";

export class DropDownCompent {
  constructor(private readonly page: Page) { }

  // FEEDBACK : use enums as inputs instead of strings

  getDropdown(Dropdown: DropDownComp): Locator {
    return this.page.getByTestId(`dropdown-field-${Dropdown}`);
  }
}
