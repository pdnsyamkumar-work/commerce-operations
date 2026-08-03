import { Page, Locator } from "@playwright/test";
import { Dropdown } from "../enums/component-enum/dropdown.enum";
export class DropdownComponent {
  constructor(readonly page: Page) {}
  getDropdown = (dropdownName: Dropdown): Locator => {
    return this.page.getByTestId(`dropdown-${dropdownName}`);
  };
  // async selectDropdownOption(dropddown: Dropdown, value: string) {
  //   await this.getDropdown(dropddown).click(value);
  // }
}
