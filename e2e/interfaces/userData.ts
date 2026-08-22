export interface signupData {
  fullName: string;

  email: string;

  companyName: string;

  password: string;

  confirmPassword: string;
}

export interface signinData {
  email: string;

  password: string;
}

export interface forgotPassword {
  email: string;
}
export interface ProductData {
  productName: string;
  productCode: string;
  category: string;
  price: string;
  stock: string;
  status: string;
  images: string[];
}
