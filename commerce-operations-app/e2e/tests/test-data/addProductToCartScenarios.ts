import { faker } from "@faker-js/faker";
import { addProductsToCart } from "../../utils/interfaces/addProdcutToCartInterface";

export class AddProductToCartTestData {
  createAddProductToCartTestData({
    overrides = {},
    excludes = [],
  }: {
    overrides?: Partial<addProductsToCart>;
    excludes?: (keyof addProductsToCart)[];
  } = {}): addProductsToCart {
    const newCartData: addProductsToCart = {
      productName: excludes.includes("productName")
        ? " "
        : faker.commerce.productName(),
    };

    return {
      ...newCartData,
      ...overrides,
    };
  }
}

export const addProductTestData = new AddProductToCartTestData();

export const addProductScenarios: Record<string, addProductsToCart> = {
  addedProductSuccessfully:
    addProductTestData.createAddProductToCartTestData({
      overrides: {
        productName: "Metro Lunch Tote",
      },
    }),

  addingProductWhichIsNotPresent:
    addProductTestData.createAddProductToCartTestData(),
};