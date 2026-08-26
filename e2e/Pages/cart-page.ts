// 1.Verify that user is able to add the product to the cart
// 2.verify that user is able to increase the quantity of the product
// 3.verify that user is able to decrease the quantity of the product
// 4. verify that user is able to view the product by clicking on 'view' button
// 5.verify that user is able to remove the product from cart by clicking on 'remove' button
// 6.verify that cart items are increased after user selected the items to to the cart
// 7.validate the the product name after adding the item to cart

import { Page } from "@playwright/test";
import { BasePage } from "./base-page";
import { HeaderComponent} from "../components/button-component";
import { CartItemComponent } from "../components/cart-item-component";

export class CartPage extends BasePage {
  readonly header: HeaderComponent;
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.header=new HeaderComponent(page);
  }
    getCartItem(productName: string, productId: string) {
  return new CartItemComponent(this.page, productName, productId);
}

  cartbtn = () => this.page.locator("//button[@title='Cart']");
  carttab = () => this.page.getByRole("button", { name: "Cart" });
  ProductDropdown = () => this.page.getByTestId("product-dropdown");
  selectproduct_btn = () => this.page.getByTestId("add-product-btn"); 
  unit_price = () => this.page.getByTestId("popup-unit-price");
  quantity = () => this.page.getByTestId("popup-quantity");
  sub_total = () => this.page.getByTestId("popup-subtotal");
  close_btn = () => this.page.getByTestId("popup-close-btn");
  cancel_btn = () => this.page.getByTestId("cancel-button");
  remove_item_btn = () => this.page.getByTestId("remove");
  async opencart() {
    await this.cartbtn().click();
  }

  async addItem(productId: string) {
    await this.ProductDropdown().click();
    await this.page.getByTestId(`product-option-${productId}`).click();
    await this.selectproduct_btn().click();
  }

  private cartItem(productName: string) {
    return this.page
      .getByRole("heading", { name: productName })
      .locator("xpath=ancestor::div[contains(@class,'rounded-[1.4rem]')]");
  }
  async validateCart(productId: string) {
    const quantity = await this.quantity().textContent();
    const unit_price = await this.unit_price().textContent();
    const sub_total = await this.sub_total().textContent();

    return {
      quantity: quantity,
      unitprice: unit_price,
      subtotal: sub_total,
    };
  }

  async close_product_popup() {
    await this.close_btn().click();
  }
}
