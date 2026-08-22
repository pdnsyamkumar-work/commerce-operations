import { faker } from "@faker-js/faker";
import { ProductData } from "../interfaces/userData";

export function createProductData(
  overrides: Partial<ProductData> = {},
): ProductData {
  const product: ProductData = {
    productName: faker.commerce.productName(),
    productCode: faker.string.alphanumeric(8).toUpperCase(),
    category: "Electronics",
    price: "12999",
    stock: "50",
    status: "Active",
    images: ["e2e/testdata/images/image.png"],
  };

  return {
    ...product,
    ...overrides,
  };
}
