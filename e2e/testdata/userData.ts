import { signupData } from "../interfaces/userData";
import { signinData } from "../interfaces/userData";
import { ProductData } from "../interfaces/userData";
import { faker } from "@faker-js/faker";

export const userSignupData: Record<string, signupData> = {
  validData: {
    fullName: "Bharath",
    email: "bharath@gmail.com",
    companyName: "Bharath Pvt Ltd",
    password: "Bharath@12",
    confirmPassword: "Bharath@12",
    expected: "",
  },
  emptyName: {
    fullName: "",
    email: "bharath@test.com",
    companyName: "ABC Pvt Ltd",
    password: "Test@123",
    confirmPassword: "Test@123",
    expected: "Full Name is required.",
  },
  emptyEmail: {
    fullName: "Bharath Reddy",
    email: "",
    companyName: "ABC Pvt Ltd",
    password: "Bharath@12",
    confirmPassword: "Test@123",
    expected: "Work email is required.",
  },

  invalidEmail: {
    fullName: "Bharath",
    email: "bharathtest.com",
    companyName: "ABC Pvt Ltd",
    password: "Test@123",
    confirmPassword: "Test@123",
    expected: "Enter a valid work email address.",
  },
  emptyCompany: {
    fullName: "Bharath Reddy",
    email: "bharath@test.com",
    companyName: "",
    password: "Test@123",
    confirmPassword: "Test@123",
    expected: "Store or company name is required.",
  },
  emptyPassword: {
    fullName: "Bharath",
    email: "bharath@test.com",
    companyName: "ABC Pvt Ltd",
    password: "",
    confirmPassword: "Wrong@123",
    expected: "Password is required.",
  },
  shortPassword: {
    fullName: "Bharath",
    email: "bharath@test.com",
    companyName: "ABC Pvt Ltd",
    password: "Test",
    confirmPassword: "Wrong@123",
    expected: "Password must be at least 8 characters long.",
  },
  emptyCnfPassword: {
    fullName: "Bharath",
    email: "bharath@test.com",
    companyName: "ABC Pvt Ltd",
    password: "Test@123",
    confirmPassword: "",
    expected: "Confirm password is required.",
  },
  passwordMismatch: {
    fullName: "Bharath",
    email: "bharath@test.com",
    companyName: "ABC Pvt Ltd",
    password: "Test@123",
    confirmPassword: "Wrong@123",
    expected: "Passwords do not match.",
  },
  existingUser: {
    fullName: "Bharath Reddy",
    email: "bharath@test.com",
    companyName: "ABC Pvt Ltd",
    password: "Test@123",
    confirmPassword: "Test@123",
    expected: "A user with this email already exists",
  },
};

export const userSigninData: Record<string, signinData> = {
  validData: {
    email: "admin@commerce.test",
    password: "Commerce@123",
    expected: "",
  },
  emptyEmail: {
    email: "",
    password: "Test@123",
    expected: "Email address is required.",
  },
  invalidEmail: {
    email: "bharathgmail.com",
    password: "Test@123",
    expected: "Enter a valid email address.",
  },
  emptyPassword: {
    email: "bharath@test.com",
    password: "",
    expected: "Invalid email or password.",
  },
  invalidCredentials: {
    email: "bharath123@test.com",
    password: "Test@123",
    expected: "Invalid email or password.",
  },
};
export const forgotPasswordData = {
  registeredMail: {
    email: "bharath@test.com",
    expected: "Password reset instructions were sent to bharath@test.com",
  },
  emptyEmail: {
    email: "",
    expected: "Work email is required.",
  },
  invalidEmail: {
    email: "bharathgmail.com",
    expected: "Enter a valid work email address.",
  },
  unregisteredMail: {
    email: "bharath123@test.com",
    expected: "No user found with this email address.",
  },
};
export const productData: Record<string, ProductData> = {
  validProduct: {
    productName: faker.commerce.productName(),
    productCode: faker.string.alphanumeric(8).toUpperCase(),
    category: "Electronics",
    price: "12999",
    stock: "50",
    status: "Active",
    images: ["e2e/testdata/images/image.png", "e2e/testdata/images/image.png"],
    expected: "",
  },

  draftProduct: {
    productName: "Samsung S25",
    productCode: "SS25001",
    category: "Electronics",
    price: "89999",
    stock: "25",
    status: "Draft",
    images: ["e2e/testdata/images/image1.png"],
    expected: "",
  },

  emptyProductName: {
    productName: "",
    productCode: "PRD001",
    category: "Electronics",
    price: "1000",
    stock: "10",
    status: "Active",
    images: ["e2e/testdata/images/image2.png"],
    expected: "Product name is required.",
  },

  emptyProductCode: {
    productName: "Laptop",
    productCode: "",
    category: "Electronics",
    price: "1000",
    stock: "10",
    status: "Active",
    images: ["e2e/testdata/images/image3.png"],
    expected: "Product code is required.",
  },

  emptyCategory: {
    productName: "Laptop",
    productCode: "LP001",
    category: "",
    price: "1000",
    stock: "10",
    status: "Active",
    images: ["e2e/testdata/images/image4.png"],
    expected: "Category is required.",
  },

  emptyPrice: {
    productName: "Laptop",
    productCode: "LP001",
    category: "Electronics",
    price: "",
    stock: "10",
    status: "Active",
    images: ["e2e/testdata/images/image5.png"],
    expected: "Price is required.",
  },

  emptyStock: {
    productName: "Laptop",
    productCode: "LP001",
    category: "Electronics",
    price: "1000",
    stock: "",
    status: "Active",
    images: ["e2e/testdata/images/image6.png"],
    expected: "Stock is required.",
  },

  noImages: {
    productName: "Laptop",
    productCode: "LP001",
    category: "Electronics",
    price: "1000",
    stock: "10",
    status: "Active",
    images: [],
    expected: "",
  },
  maxImages: {
    productName: "Laptop",
    productCode: "LP003",
    category: "Electronics",
    price: "1003",
    stock: "15",
    status: "Active",
    images: [
      "e2e/testdata/images/image7.png",
      "e2e/testdata/images/image8.png",
      "e2e/testdata/images/image.png",
      "e2e/testdata/images/image1.png",
      "e2e/testdata/images/image2.png",
      "e2e/testdata/images/image3.png",
      "e2e/testdata/images/image4.png",
    ],
    expected: "You can upload only 6 more images. Maximum 6 images allowed.",
  },
  duplicateProduct: {
    productName: "Samsung S25",
    productCode: "SS25001",
    category: "Electronics",
    price: "89999",
    stock: "25",
    status: "Draft",
    images: ["e2e/testdata/images/image1.png"],
    expected: "A product with this code already exists.",
  },
};
export const cartData: Record<string, { itemName: string; price: string }> = {
  product1: {
    itemName: "Metro Lunch Tote",
    price: "34",
  },
  product2: {
    itemName: "Canvas Weekender Bag",
    price: "84",
  },
};
