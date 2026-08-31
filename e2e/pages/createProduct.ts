import { Page, Locator } from "@playwright/test";
import { ProductData } from "../interfaces/userData";
import { BasePage } from "./basePage";
import { Buttons, MenuItems } from "../enums/component-enum/buttons.enums";
import { TextField } from "../enums/component-enum/text-field.enum";
import { Dropdown } from "../enums/component-enum/dropdown.enum";
import { FileUploadComponent } from "../components/fileupload.component";
import { FileUpload } from "../enums/component-enum/fileupload.enum";
export class createProduct extends BasePage {
    // FEEDBACK: Constructor is not required since this feature class inherited from base page class

  constructor(page: Page) {
    super(page);
  }
  getProductPageLink(): Locator {
    return this.button.getMenuItem(MenuItems.PRODUCTS);
  }
  getProductNameField(): Locator {
    return this.field.getInputField(TextField.PRODUCT_NAME);
  }
  getProductCodeField(): Locator {
    return this.field.getInputField(TextField.PRODUCT_CODE);
  }
  getCategoryField(): Locator {
    return this.field.getInputField(TextField.CATEGORY);
  }
  getPriceField(): Locator {
    return this.field.getInputField(TextField.PRICE);
  }
  getStockField(): Locator {
    return this.field.getInputField(TextField.STOCK);
  }
  getStatusDropdown(): Locator {
    return this.page.getByTestId("dropdown-product-status");
  }
  getChooseFiles(): Locator {
    return this.page.getByTestId("button-choose-files");
  }
  getCreateProductBtn(): Locator {
    return this.button.getButton(Buttons.CREATE_PRODUCT);
  }
  getProductHeading(): Locator {
    return this.page.getByTestId("heading-create-product");
  }
  getProductNameError(): Locator {
    return this.page.getByTestId("error-product-name");
  }
  getProductCodeError(): Locator {
    return this.page.getByTestId("error-product-code");
  }
  getCategoryError(): Locator {
    return this.page.getByTestId("error-product-category");
  }
  getPriceError(): Locator {
    return this.page.getByTestId("error-product-price");
  }
  getStockError(): Locator {
    return this.page.getByTestId("error-product-stock");
  }
  getProductStatusError(): Locator {
    return this.page.getByTestId("error-product-status");
  }
  getProductImagesError(): Locator {
    return this.page.getByTestId("error-product-files");
  }

  async navigateToProductsPage() {
    await this.button.getMenuItem(MenuItems.PRODUCTS).click();
    // await this.clickElement(this.getProductPageLink());
    // await this.productsLink.click();
  }
  async fillCreateProductForm(data: ProductData) {
    await this.field
      .getInputField(TextField.PRODUCT_NAME)
      .fill(data.productName);
    await this.field
      .getInputField(TextField.PRODUCT_CODE)
      .fill(data.productCode);
    await this.field.getInputField(TextField.CATEGORY).fill(data.category);
    await this.field.getInputField(TextField.PRICE).fill(data.price);
    await this.field.getInputField(TextField.STOCK).fill(data.stock);
    await this.dropdown.getDropdown(Dropdown.STATUS).selectOption(data.status);

    // await this.selectDropdownOption(this.getStatusDropdown(), data.status);
    await this.uploadfile
      .getFileUploadButton(FileUpload.CHOOSE_FILES)
      .setInputFiles(data.images);

    // await this.uploadFile(this.button.getButton(Buttons.CHOOSE_FILES),data.images)

    //   await this.fillField(this.getProductNameField(), data.productName);
    //   await this.fillField(this.getProductCodeField(), data.productCode);
    //   await this.fillField(this.getCategoryField(), data.category);
    //   await this.fillField(this.getPriceField(), data.price);
    //   await this.fillField(this.getStockField(), data.stock);
    //   await this.selectDropdownOption(this.getStatusDropdown(), data.status);
    //   await this.setFiles(this.getChooseFiles(), data.images);
  }

  async clickOnCreateProduct() {
    await this.button.getButton(Buttons.CREATE_PRODUCT).click();
    // await this.clickElement(this.getCreateProductBtn());
  }
}
