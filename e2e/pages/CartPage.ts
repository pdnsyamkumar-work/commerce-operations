import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";
export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  getDropdownField=()=> this.page.getByTestId("cart-product-dropdown");
  getAddSelectedProductButton=()=> this.page.getByTestId("button-add-selected-product");
  getDropdownOption=(itemName:string)=>this.page.getByTestId(`dropdown-option-${itemName}`);
  getViewButton=(productName:string)=>this.page.getByTestId(`button-view-${productName}`)
  getCartHeading=()=>this.page.getByTestId("heading-cart");
  getDialogQty=(productName:string)=>this.page.getByTestId(`${productName}-quantity`)
  getIncrementQtyField=(productName: string)=>this.page.getByTestId(`button-increment-${productName}`);
  
  getRemoveItemButton=(productName: string)=>this.page.getByTestId(`button-Remove-${productName}`);
  getRemoveConfirmationDialog=()=>this.page.getByTestId("button-Remove Item");
  
  getProductName = (itemName: string) => this.page.getByTestId(`product-${itemName}`);

  getProductPrice=(productName: string)=>this.page.getByTestId(`price-${productName}`);
  getCartCount=()=>this.page.getByTestId('summary-cart-items-count');
  getProductQuantity=(productName:string)=>this.page.getByTestId(`${productName}-quantity`);
  async clickOnCartIcon() {
    await this.clickElement(this.getNavItem('Cart'));
  }
  async AddItemToCart(item: string) {
    await this.selectCustomDropdownOption(this.getDropdownField(), item);
    await this.clickElement(this.getAddSelectedProductButton());
  }
  async updateQty(item: string) {
    await this.clickElement(this.getIncrementQtyField(item));
  }
  async removeItem(item: string) {
    await this.clickElement(this.getRemoveItemButton(item));
    await this.clickElement(this.getRemoveConfirmationDialog());
  }
  
}
