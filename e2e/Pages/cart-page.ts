// Cart Module - Automation Scenarios
/*
1. Verify that all products created in the Products module are displayed in the "Choose Product" dropdown of the Cart module.
2. Verify that the Products count on the Cart page matches the total number of products available in the Products module.
3. Verify that the Cart Items count is updated based on the number of products added to the cart.
4. Verify that the Cart Total is calculated as the sum of all products added to the cart.
5. Verify that a selected product can be successfully added to the cart from the "Choose Product" dropdown.
6. Verify that increasing or decreasing the quantity of a product updates both the individual product total and the overall Cart Total accordingly.
7. Verify that the details of a product added to the cart are displayed correctly when the "View" option is selected.
8. Verify that a product can be removed successfully from the cart.
9. Verify that removing a product updates the Cart Items count and recalculates the Cart Total correctly.
10. Verify that multiple products can be added to the cart and that all added products are displayed with the correct quantities, item count, and total cart value.
*/
import { Page } from "@playwright/test";
import Sign_in from "./sign-in-page";
import { testData } from "../testdata/sign-in-data";

export default class carts {
  private sign_in: Sign_in;

  constructor(private page: Page) {
    this.sign_in = new Sign_in(page);
  }

  //Locators
  carts_tab = () => this.page.locator("//button[@title='Cart']");
  chooseProductDropdown = () =>
    this.page.getByTestId("choose-product-dropdown");
  product_option = (productName: string) =>
    this.page.getByTestId(`cart-product-${productName}`);
  Addproduct_btn = () => this.page.getByTestId("Add-select-Product");
  // productCard = (productName: string) =>this.page.getByTestId("cart-item").filter({ hasText: productName });
  productCard = (productName: string) =>
    this.page.getByTestId(`cart-item-${productName}`);

  //cart_prd_name = (productName: string) =>this.productCard(productName).getByTestId("cart-product-name");

  prd_view_btn = (productName: string) =>
    this.page.getByTestId(`view-product-${productName}`);

  prod_incr_btn = (productName: string) =>
    this.page.getByTestId(`incr-product-qnty-${productName}`);

  prod_decr_btn = (productName: string) =>
    this.page.getByTestId(`decr-product-qnty-${productName}`);

  prdt_remove = (productName: string) =>
    this.page.getByTestId(`remove-product-${productName}`);

  remove_popup = () => this.page.getByRole("dialog");

  remove_popup_title = () =>
    this.page.getByRole("heading", { name: "Remove item from cart?" });

  cancel_btn = () => this.page.getByRole("button", { name: "Cancel" });

  confirm_remove_btn = () =>
    this.page.getByRole("button", { name: "Remove Item" });

  cart_empty_msg = () =>
    this.page.getByText(
      "Cart is empty. Add a product to begin checkout preparation.",
    );

  view_popup = () => this.page.getByRole("dialog");

  view_popup_title = (productName: string) =>
    this.page.getByTestId(`view-product-name-${productName}`);

  view_popup_quantity = (productName: string) =>
    this.page.getByTestId(`product-quantity-${productName}`);

  close_view_popup = (productName: string) =>
    this.page.getByTestId(`close-product-popup-${productName}`);

  //This method will first tries to login into the applocationa and perform the add product , we are calling the signin method form the signin page
  async login_navig_toCarts() {
    await this.sign_in.navigate();
    await this.sign_in.login(testData.adminUser);
    await this.carts_tab().click();
  }

  //Chooose the product form the dropdown

  async choose_prod_frm_drpdwn(productName: string) {
    await this.chooseProductDropdown().click();
    await this.product_option(productName).click();
  }

  //click on Add Product Button after chossing the prod form the Dropdwon
  async click_Add_Prd_Btn() {
    await this.Addproduct_btn().click();
  }

  //Increase the Qnty for the added prod
  async increase_prdt_qnty(productName: string) {
    await this.prod_incr_btn(productName).click();
  }

  //Decrease the Qnty for the added prod
  async decrease_prdt_qnty(productName: string) {
    await this.prod_decr_btn(productName).click();
  }

  //View the Prod for the added prod
  async view_prdt(productName: string) {
    await this.prd_view_btn(productName).click();
  }

  //Remove the prod for the added prod
  async remove_prdt(productName: string) {
    await this.prdt_remove(productName).click();
  }
  async close_view_popup_btn(productName: string) {
    await this.close_view_popup(productName).click();
  }

  quantity = (productName: string) =>
    this.page
      .getByRole("heading", { name: productName, exact: true })
      .locator("xpath=ancestor::div[contains(@class,'rounded')]")
      .getByText(/^\d+$/);

  //  // Remove all products from cart
  //  async remove_all_products() {

  //   if (await this.cart_empty_msg().isVisible()) {
  //     return;
  //   }

  //   while (await this.prdt_remove().count() > 0) {
  //     await this.prdt_remove().first().click();
  //       await this.remove_popup().waitFor();
  //     await this.click_confirm_remove_btn();

  //     // Wait for the confirmation dialog to disappear
  //     await this.remove_popup().waitFor({ state: "hidden" });
  //   }
  // }

  async click_cancel_btn() {
    await this.cancel_btn().click();
  }

  async click_confirm_remove_btn() {
    await this.confirm_remove_btn().click();
  }
}
