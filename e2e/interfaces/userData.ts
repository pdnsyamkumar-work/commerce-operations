export interface signupData {
  fullName: string;

  email: string;

  companyName: string;

  password: string;

  confirmPassword: string;
  expected: string;
}

export interface signinData {
  email: string;

  password: string;
  expected: string;
}

export interface forgotPassword {
  email: string;
  expected: string;
}
export interface ProductData {
  productName: string;
  productCode: string;
  category: string;
  price: string;
  stock: string;
  status: string;
  images: string[];
  expected: string;
}
