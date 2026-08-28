import { faker } from "@faker-js/faker";
import { ProductData } from "../interfaces/userData";

export function createProductData(
  overrides: Partial<ProductData> = {},
  excludes: (keyof ProductData)[] = [],
  only: (keyof ProductData)[] = [],
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

  let data = {
    ...product,
    ...overrides,
  };
  if (only.length > 0) {
    data = Object.fromEntries(
      only.map((key) => [key, data[key]]),
    ) as typeof data;
  }

  for (const field of excludes) {
    delete data[field];
  }

  return data;

  // FEEDBACK: Missing Exclusions Logic
}

//
