export enum TextFiled {
  //Sign in
  EMAIL_ADDRESS = "emailAddress",
  PASSWORD = "password",

  //  // Sign Up
  FULL_NAME = "fullName",
  WORK_EMAIL = "emailAddress",
  COMPANY_NAME = "companyName",
  SIGN_UP_PASSWORD = "password",
  CONFIRM_PASSWORD = "confirmPassword",

  //Create Product 
  PRODUCT_NAME="product-name",
  PRODUCT_CODE="product-code",
  CATEGORY="category",
  PRICE="price",
  STOCK="stock",
  STATUS="status",
  PRODUCT_IMAGES="product-images"
}

export enum Buttons {
  SIGN_IN = "sign-in",
  SIGN_UP = "Sign-up",
  SIGN_OUT = "sign-out",
  FORGOT_PASSWORD = "Forgot-pwd",
  PROFILE_DROPDOWN = "dropdown-profile",
  CREATE_ACCOUNT = "create-account",

  //Create Product
  CREATE_PRODUCT="create-product"
}

export enum ErrorField {
  FULL_NAME = "fullName",
  EMAIL_ADDRESS = "emailAddress",
  COMPANY_NAME = "companyName",
  PASSWORD = "password",
  CONFIRM_PASSWORD = "confirmPassword",
  LOGIN_ERROR = "invalid-email-or-password",


  //Add Product Inline Error Messages
  PRODUCT_NAME_REQUIRED = "product-name-required",
  PRODUCT_NAME_MIN = "product-name-min",
  PRODUCT_NAME_MAX = "product-name-max",
  PRODUCT_NAME_CHAR = "product-name-char",

  PRODUCT_CODE_REQUIRED = "product-code-required",
  PRODUCT_CODE_MAX = "product-code-max",
  PRODUCT_CODE_CHAR = "product-code-char",

  CATEGORY_REQUIRED = "category-required",
  CATEGORY_MIN = "category-min",
  CATEGORY_MAX = "category-max",
  CATEGORY_CHAR = "category-char",

  PRICE_REQUIRED = "price-required",
  PRICE_MAX = "price-max",
  PRICE_MIN = "price-min",
  PRICE_VALUE_MAX = "price-value-max",

  STOCK_REQUIRED = "stock-required",
  STOCK_MAX = "stock-max",
  STOCK_INVALID = "stock-invalid",
  STOCK_VALUE_MAX = "stock-value-max",

   STATUS_REQUIRED = "status",

  PRODUCT_IMAGES_REQUIRED = "product-images-required",
  PRODUCT_IMAGES_LIMIT = "product-images-limit",


}
