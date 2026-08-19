import { addProductsToCart } from "../../utils/interfaces/cartsInterface";

export const addProductScenarios: Record<string, addProductsToCart> = {
  addedProductSuccessfully: {
    productName: "Trail Packing Cube",
  },

  addingProductWhichIsNotPresent: {
    productName: "Manjula Shoes",
  },

  addingProductWithEmptyName: {
    productName: "",
  },

  addingProductWithInvalidName: {
    productName: "InvalidProduct123",
  },

  addingAlreadyAddedProduct: {
    productName: "Manjula Bag",
  },
};