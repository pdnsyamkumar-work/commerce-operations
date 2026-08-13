import { test, expect } from "@playwright/test";
import { Createproductpage } from "../Pages/products-page";
import { ProductData } from "../utils/interfaces/products.interface";
import { products_data } from "../testdata/products-data";
import { SigninPage } from "../Pages/signin-page";

test("Verify user can create product with all the valid details", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const signin = new SigninPage(page);
  const product = new Createproductpage(page);
  await signin.clickSigninButton();
  await product.navigateToProductsPage();
  await product.fillCreateProductForm(products_data[0]);
  const responsepromise = product.waitForCreateProductResponse();
  await product.clickOnCreateProduct();
  const response = await responsepromise;
  expect(response.status()).toBe(201);
});

test("Verify user can create the product with the inavlid details", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const signin = new SigninPage(page);
  const product = new Createproductpage(page);
  await signin.clickSigninButton();
  await product.navigateToProductsPage();
  await product.fillCreateProductForm(products_data[1]);
  await expect(page.getByText("Product name is required.")).toBeVisible();
  await expect(page.getByText("Product code is required.")).toBeVisible();
});

test("Verify user can create product with inavlid product name", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const signin = new SigninPage(page);
  const product = new Createproductpage(page);
  await signin.clickSigninButton();
  await product.navigateToProductsPage();
  await product.fillCreateProductForm(products_data[2]);
  await expect(
    page.getByText("Product name must be at least 3 characters."),
  ).toBeVisible();
  await expect(page.getByText("Product code is required.")).toBeVisible();
});

test("Verify user can create product with inavlid product category", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const signin = new SigninPage(page);
  const product = new Createproductpage(page);
  await signin.clickSigninButton();
  await product.navigateToProductsPage();
  await product.fillCreateProductForm(products_data[3]);
  await expect(
    page.getByText("Category must be at least 2 characters."),
  ).toBeVisible();
});

test("Verify user can create product with invalid stock", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const signin = new SigninPage(page);
  const product = new Createproductpage(page);
  await signin.clickSigninButton();
  await product.navigateToProductsPage();
  await product.fillCreateProductForm(products_data[4]);
  await expect(
    page.getByText("Stock must be at most 5 characters."),
  ).toBeVisible();
});

test("Verify user can create product with inavlid price", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const signin = new SigninPage(page);
  const product = new Createproductpage(page);
  await signin.clickSigninButton();
  await product.navigateToProductsPage();
  await product.fillCreateProductForm(products_data[5]);
  await expect(page.getByText("Price must be at most 99,999.")).toBeVisible();
});
