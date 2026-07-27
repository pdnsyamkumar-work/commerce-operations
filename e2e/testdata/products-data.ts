import { ProductData } from "../utils/interfaces/product.interface";

export const testData: Record<string, ProductData> = {
  validProduct: {
    productName: "Aero Trek Backpack",
    productCode: "ATB-900",
    category: "Adventure Gear",
    price: "1299",
    stock: "45",
    status: "Active",
    imagePath: "C:/Users/cawdev/OneDrive/Attachments/OIP.webp",
  },

  duplicateProduct: {
    productName: "Aero Trek Backpack",
    productCode: "ATB-501", // Existing Product Code
    category: "Adventure Gear",
    price: "1299",
    stock: "45",
    status: "Active",
    imagePath: "C:/Users/cawdev/OneDrive/Attachments/OIP.webp",
  },
};

export const imageUploadData = {
  imagePaths: [
    "C:/Users/cawdev/OneDrive/Attachments/OIP.webp",
    "C:/Users/cawdev/OneDrive/Attachments/OIP.webp",
    "C:/Users/cawdev/OneDrive/Attachments/OIP.webp",
    "C:/Users/cawdev/OneDrive/Attachments/OIP.webp",
    "C:/Users/cawdev/OneDrive/Attachments/OIP.webp",
    "C:/Users/cawdev/OneDrive/Attachments/OIP.webp",
  ],
};

export const multipleProductsData: ProductData[] = [
  {
    productName: "Nimbus Smart Bottle",
    productCode: "NSB-502",
    category: "Lifestyle",
    price: "799",
    stock: "60",
    status: "Draft",
    imagePath: "C:/Users/cawdev/OneDrive/Attachments/OIP.webp",
  },

  {
    productName: "Vertex Laptop Stand",
    productCode: "VLS-503",
    category: "Accessories",
    price: "999",
    stock: "50",
    status: "Active",
    imagePath: "C:/Users/cawdev/OneDrive/Attachments/OIP.webp",
  },
  {
    productName: "Vertex Laptop Stand",
    productCode: "VLS-509",
    category: "Accessories",
    price: "999",
    stock: "50",
    status: "Active",
    imagePath: "C:/Users/cawdev/OneDrive/Attachments/OIP.webp",
  },
];

export const negativeProductsData: ProductData[] = [
  {
    productName: "",
    productCode: "PRD-601",
    category: "Home Office",
    price: "1599",
    stock: "25",
    status: "Draft",
    imagePath: "C:/Users/cawdev/OneDrive/Attachments/OIP.webp",
  },

  {
    productName: "@#$%^&*",
    productCode: "PRD-602",
    category: "Home Office",
    price: "1599",
    stock: "25",
    status: "Draft",
    imagePath: "C:/Users/cawdev/OneDrive/Attachments/OIP.webp",
  },

  {
    productName: "Valid Product",
    productCode: "",
    category: "Home Office",
    price: "1599",
    stock: "25",
    status: "Draft",
    imagePath: "C:/Users/cawdev/OneDrive/Attachments/OIP.webp",
  },
];
