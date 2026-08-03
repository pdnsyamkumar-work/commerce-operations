import { Locator, Page } from "@playwright/test";
import { Buttons, MenuItems } from "../enums/component-enum/buttons.enums";
export class ButtonComponent {
  constructor(readonly page: Page) {}
  readonly getButton = (buttonName: Buttons): Locator => {
    return this.page.getByTestId(`button-${buttonName}`);
  };
  readonly getMenuItem = (menuItemName: string): Locator => {
    return this.page.getByTestId(`menu-item-${menuItemName}`);
  };
}
