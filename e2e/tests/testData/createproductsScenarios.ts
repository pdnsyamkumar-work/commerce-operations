import { faker } from "@faker-js/faker";
import { createProductElements } from "../../utils/interfaces/createproductInterface";

export class CreateProductTestData {

  createProductTestData({
    overrides = {},
    excludes = [],
  }: {
    overrides?: Partial<createProductElements>;
    excludes?: (keyof createProductElements)[];
  }): createProductElements {

    const newProductData: createProductElements = {
      productName: excludes.includes("productName")
        ? ""
        : faker.commerce.productName(),

      productCode: excludes.includes("productCode")
        ? ""
        : `PRD-${faker.string.numeric(6)}`,

      category: excludes.includes("category")
        ? ""
        : "Home",

      price: excludes.includes("price")
        ? ""
        : faker.commerce.price({
            min: 100,
            max: 500,
            dec: 0,
          }),

      stock: excludes.includes("stock")
        ? ""
        : faker.number.int({
            min: 1,
            max: 100,
          }).toString(),

      status: excludes.includes("status")
        ? ""
        : "Active",

      imagePaths: excludes.includes("imagePaths")
        ? []
        : ["C:\\Users\\korra\\Downloads\\IMG_0370.png"],
    };

    return {
      ...newProductData,
      ...overrides,
    };
  }

  successfulProductCreation() {
    return this.createProductTestData({
      overrides: {
        category: "Home",
        status: "Active",
      },
    });
  }

  duplicateProductCode() {
    return this.createProductTestData({
      overrides: {
        productCode: "PRD-106",
        category: "Home",
        status: "Active",
      },
    });
  }

  productCreationWithoutProductName() {
    return this.createProductTestData({
      excludes: ["productName"],
      overrides: {
        category: "Home",
        status: "Active",
      },
    });
  }

  productCreationWithoutProductCode() {
    return this.createProductTestData({
      excludes: ["productCode"],
      overrides: {
        category: "Home",
        status: "Active",
      },
    });
  }
}

export const createProductTestData = new CreateProductTestData();

export const createProductAllScenarios = {

  Successful_Product_Creation:
    createProductTestData.successfulProductCreation(),

  Product_Creation_With_Duplicate_ProductCode:
    createProductTestData.duplicateProductCode(),

  Product_Creation_Without_ProductName:
    createProductTestData.productCreationWithoutProductName(),

  Product_Creation_Without_ProductCode:
    createProductTestData.productCreationWithoutProductCode(),
};