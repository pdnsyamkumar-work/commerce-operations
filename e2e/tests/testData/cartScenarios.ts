import { faker } from "@faker-js/faker";
import { addProductsToCart } from "../../utils/interfaces/cartsInterface";

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

  addedProductSuccessfully() {
    return this.createCartTestData({
      overrides: {
        productName: "Trail Packing Cube",
      },
    });
  }

  addingProductWhichIsNotPresent() {
    return this.createCartTestData({
      overrides: {
        productName: faker.commerce.productName(),
      },
    });
  }

  addingProductWithEmptyName() {
    return this.createCartTestData({
      excludes: ["productName"],
    });
  }

  addingProductWithInvalidName() {
    return this.createCartTestData({
      overrides: {
        productName: `InvalidProduct${faker.string.numeric(6)}`,
      },
    });
  }

  addingAlreadyAddedProduct() {
    return this.createCartTestData({
      overrides: {
        productName: "Manjula Bag",
      },
    });
  }
}

export const cartTestData = new CartTestData();

export const addProductScenarios = {

  addedProductSuccessfully:
    cartTestData.addedProductSuccessfully(),

  addingProductWhichIsNotPresent:
    cartTestData.addingProductWhichIsNotPresent(),

  addingProductWithEmptyName:
    cartTestData.addingProductWithEmptyName(),

  addingProductWithInvalidName:
    cartTestData.addingProductWithInvalidName(),

  addingAlreadyAddedProduct:
    cartTestData.addingAlreadyAddedProduct(),
};