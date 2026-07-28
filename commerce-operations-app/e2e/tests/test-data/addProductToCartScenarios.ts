import { addProductsToCart } from "../../utils/interfaces/addProdcutToCartInterface";

export const addProductScenarios: Record<string, addProductsToCart> = {
  addedProductSuccessfully: {
    productName: "Metro Lunch Tote",
  },
  addingProductWhichIsNotPresent: {
    productName: "Baggy jeans",
  },
};
