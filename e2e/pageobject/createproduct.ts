import { Page, Locator } from '@playwright/test';

export class CreateProductPage {
  readonly page: Page;

  readonly productsTab: Locator;
  readonly createProductHeading: Locator;
  readonly productName: Locator;
  readonly productCode: Locator;
  readonly category: Locator;
  readonly price: Locator;
  readonly stock: Locator;
  readonly status: Locator;
  readonly productImages: Locator;
  readonly createProductButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Products
    this.productsTab = page.getByTitle('Products');

    // Create Product form
    this.createProductHeading = page.getByRole('heading', { name: 'Create product',
    });

    this.productName = page.getByLabel('Product name');
    this.productCode = page.getByLabel('Product code');
    this.category = page.getByLabel('Category');
    this.price = page.getByLabel('Price');
    this.stock = page.getByLabel('Stock');
    this.status = page.locator('form label:has-text("Status") select');

    this.productImages = page.locator('input[type="file"]');
    this.createProductButton = page.getByRole('button', {name: 'Create product',});
  }
   async navigate(url: string) {
    await this.page.goto(url);
  }

  async goToProducts() {
    await this.productsTab.click();
  }
  async waitForCreateProductApi() {
  return await this.page.waitForResponse(
    (response) =>
      response.url().includes('/api/products') &&
      response.request().method() === 'POST'
  );
}

  async createProduct(
    productName: string,
    productCode: string,
    category: string,
    price: string,
    stock: string,
    status: string,
    imagePath: string[],
    clickCreate: boolean = true
  ) {
    await this.productName.fill(productName);
    await this.productCode.fill(productCode);
   await this.category.fill(category);
    await this.price.fill(price);
    await this.stock.fill(stock);
   await this.status.selectOption({ label: status });

    if (imagePath.length > 0) {
      await this.productImages.setInputFiles(imagePath);
    }
     if (clickCreate) {
    await this.createProductButton.click();
  }
     
  }
}
