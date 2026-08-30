import { Locator, Page } from "@playwright/test";
import { Dropdown } from "../enums/dropdown.enums";

export class DropdownComponent {
  constructor(readonly page: Page) {}

  readonly getDropdown = (dropdownName: Dropdown): Locator => {
    return this.page.getByTestId(`dropdown-${dropdownName}`);
  };

  readonly getSelectDropdown = (dropdownName: Dropdown): Locator => {
    return this.page.getByTestId(`dropdown-select ${dropdownName}`);
  };

  readonly getDropdownOption = (optionName: string): Locator => {
    return this.page.getByTestId(`dropdown-option-${optionName}`);
  };
}