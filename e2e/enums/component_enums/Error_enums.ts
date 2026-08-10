export enum ErrorField {
  FULL_NAME = "fullName",
  EMAIL_ADDRESS = "emailAddress",
  COMPANY_NAME = "companyName",
  PASSWORD = "password",
  CONFIRM_PASSWORD = "confirmPassword",
  LOGIN_ERROR = "invalid-email-or-password",

  //Add Product Inline Error Messages
  PRODUCT_NAME_REQUIRED = "product-name-required",
  PRODUCT_NAME_MIN = "Product name must be at least 3 characters.",
  PRODUCT_NAME_MAX = "product-name-should not exceed more than 100 characters.",
  PRODUCT_NAME_CHAR = "product-name-may contain letters, numbers, spaces, &, apostrophes, or hyphens.",

  PRODUCT_CODE_REQUIRED = "product-code-required",
  PRODUCT_CODE_MAX = "Product code must be at most 20 characters",
  PRODUCT_CODE_CHAR = "Product code may contain letters, numbers, and hyphens only",

  CATEGORY_REQUIRED = "category-required",
  CATEGORY_MIN = "Category must be at least 2 characters",
  CATEGORY_MAX = "Category must be at most 40 characters",
  CATEGORY_CHAR = "Category may contain letters and spaces only",

  PRICE_REQUIRED = "price-required",
  PRICE_MAX = "Price must be at most 7 characters",
  PRICE_MIN = "price-must be at least 1",
  PRICE_VALUE_MAX = "Price must be at most 99,999.",

  STOCK_REQUIRED = "stock-required",
  STOCK_MAX = "stock at most 5 characters",
  STOCK_INVALID = "stock-invalid",
  STOCK_VALUE_MAX = "stock-value-max",

  STATUS_REQUIRED = "status",

  PRODUCT_IMAGES_REQUIRED = "product-images-required",
  PRODUCT_IMAGES_LIMIT = "product-images-limit",
}