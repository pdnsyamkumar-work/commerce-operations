import type { ProductDraft, ProductFormErrors } from "./types";

const productCodePattern = /^[a-zA-Z0-9][a-zA-Z0-9-]*$/;
const productNamePattern = /^[a-zA-Z0-9][a-zA-Z0-9 &'-]*$/;
const categoryPattern = /^[a-zA-Z][a-zA-Z ]*$/;
const maxProductCodeLength = 20;
const maxProductNameLength = 100;
const maxCategoryLength = 40;
const maxPriceLength = 7;
const maxStockLength = 5;

export type ProductFieldName = keyof ProductDraft;

export function validateProductDraft(
  draft: ProductDraft,
): ProductFormErrors {
  const errors: ProductFormErrors = {};
  const productCode = draft.productCode?.trim() ?? "";
  const name = draft.name?.trim() ?? "";
  const category = draft.category?.trim() ?? "";
  const priceValue = draft.price ?? "";
  const stockValue = draft.stock ?? "";
  const price = Number(priceValue);
  const stock = Number(stockValue);

  if (!productCode) {
    errors.productCode = "Product code is required.";
  } else if (productCode.length > maxProductCodeLength) {
    errors.productCode = `Product code must be at most ${maxProductCodeLength} characters.`;
  } else if (!productCodePattern.test(productCode)) {
    errors.productCode =
      "Product code may contain letters, numbers, and hyphens only.";
  }

  if (!name) {
    errors.name = "Product name is required.";
  } else if (name.length < 3) {
    errors.name = "Product name must be at least 3 characters.";
  } else if (name.length > maxProductNameLength) {
    errors.name = "Product name should not exceed more than 100 characters.";
  } else if (!productNamePattern.test(name)) {
    errors.name =
      "Product name may contain letters, numbers, spaces, &, apostrophes, or hyphens.";
  }

  if (!category) {
    errors.category = "Category is required.";
  } else if (category.length < 2) {
    errors.category = "Category must be at least 2 characters.";
  } else if (category.length > maxCategoryLength) {
    errors.category = `Category must be at most ${maxCategoryLength} characters.`;
  } else if (!categoryPattern.test(category)) {
    errors.category = "Category may contain letters and spaces only.";
  }

  if (!priceValue) {
    errors.price = "Price is required.";
  } else if (priceValue.length > maxPriceLength) {
    errors.price = `Price must be at most ${maxPriceLength} characters.`;
  } else if (!Number.isFinite(price) || price < 1) {
    errors.price = "Price must be at least 1.";
  } else if (price > 99999) {
    errors.price = "Price must be at most 99,999.";
  }

  if (!stockValue) {
    errors.stock = "Stock is required.";
  } else if (stockValue.length > maxStockLength) {
    errors.stock = `Stock must be at most ${maxStockLength} characters.`;
  } else if (!Number.isInteger(stock) || stock < 0) {
    errors.stock = "Stock must be a whole number greater than or equal to 0.";
  } else if (stock > 10000) {
    errors.stock = "Stock must be at most 10,000 units.";
  }

  if (!draft.status) {
    errors.status = "Status is required.";
  }

  if ((draft.images?.length ?? 0) === 0) {
    errors.images = "At least one product image is required.";
  }

  return errors;
}

export function validateProductField(
  draft: ProductDraft,
  field: ProductFieldName,
): string | undefined {
  return validateProductDraft(draft)[field];
}

