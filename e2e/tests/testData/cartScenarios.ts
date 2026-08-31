import { faker } from "@faker-js/faker";
import { addProductsToCart } from "../../utils/interfaces/cartsInterface";

/*
  Overrides are used to override the default test data.
  Excludes are used to exclude fields from the default test data.
*/

export class CartTestData {
  createCartTestData({
    overrides = {},
    excludes = [],
  }: {
    overrides?: Partial<addProductsToCart>;
    excludes?: (keyof addProductsToCart)[];

  }): addProductsToCart {

    const newCartData: addProductsToCart = {
      productName: excludes.includes("productName")
        ? ""
        : faker.commerce.productName(),
    };

    return {
      ...newCartData,
      ...overrides,
    };
  }
}

// FEEDBACK: Keep all the overrides inside the function implenmented in above class and do the same for all other testdata classes
export const cartTestData = new CartTestData();

export const addProductScenarios = {

  addedProductSuccessfully:
    cartTestData.createCartTestData({
      overrides: {
        productName: "Trail Packing Cube",
      },
    }),

  addingProductWhichIsNotPresent:
    cartTestData.createCartTestData({
      overrides: {
        productName: faker.commerce.productName(),
      },
    }),

  addingProductWithEmptyName:
    cartTestData.createCartTestData({
      excludes: ["productName"],
    }),

  addingProductWithInvalidName:
    cartTestData.createCartTestData({
      overrides: {
        productName: `InvalidProduct${faker.string.numeric(6)}`,
      },
    }),

  addingAlreadyAddedProduct:
    cartTestData.createCartTestData({
      overrides: {
        productName: "Manjula Bag",
      },
    }),
};