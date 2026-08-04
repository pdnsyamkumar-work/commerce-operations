import { test, Response } from "@playwright/test";
import Products from "../Pages/products-page";
import {
  testData,
  imageUploadData,
  multipleProductsData,
  negativeProductsData,
} from "../testdata/products-data";
import SignInPage from "../Pages/sign-in-page";

test.describe("Products Module", () => {
  let products: Products;
  let signInPage: SignInPage;

  test.beforeEach(async ({ page }) => {
    products = new Products(page);
     signInPage = new SignInPage(page);
    await test.step("Launch the application", async () => {
      await signInPage.navigate();
  });

  test("Verify user can create a product successfully with valid data", async () => {
    await products.createProduct(testData.validProduct);
  });

  test("Verify user can create multiple products successfully", async () => {
    await products.createMultipleProducts(multipleProductsData);
  });

  test("Verify system displays duplicate product code message when product code already exists", async () => {
    await products.createProduct(testData.duplicateProduct);
  });

  test("Verify user cannot upload more than 6 product images", async () => {
    await products.uploadMultipleImages(imageUploadData.imagePaths);

    await products.verifyMaximumImagesReached();
  });

  test("Verify Create Product button remains disabled and validation messages are displayed for invalid product details", async () => {
    await products.create_btn_state(negativeProductsData);
  });


  });
