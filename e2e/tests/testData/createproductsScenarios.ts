import path from 'path';
import { createProductElements } from "../../utils/interfaces/createproductInterface";


const generateProductCode = (): string => {
  return `PRD-${Date.now()}`;
};

export const createProductAllScenarios: Record<
  string,
  createProductElements
> = {

  Successful_Product_Creation: {
    productName: "Manjula Bag",
    productCode: generateProductCode(),
    category: "Home",
    price: "212",
    stock: "21",
    status: "Active",
    imagePaths: ["C:\\Users\\korra\\Downloads\\IMG_0370.png"],
  },

  Product_Creation_With_Duplicate_ProductCode: {
    productName: "Manjula Bag",
    productCode: "PRD-106",
    category: "Home",
    price: "212",
    stock: "21",
    status: "Active",
    imagePaths: ["C:\\Users\\korra\\Downloads\\IMG_0370.png"],
  },

  Product_Creation_Without_ProductName: {
    productName: "",
    productCode: generateProductCode(),
    category: "Home",
    price: "212",
    stock: "21",
    status: "Active",
    imagePaths: ["C:\\Users\\korra\\Downloads\\IMG_0370.png"],
  },

  Product_Creation_Without_ProductCode: {
    productName: "Manjula Bag",
    productCode: "",
    category: "Home",
    price: "212",
    stock: "21",
    status: "Active",
    imagePaths: ["C:\\Users\\korra\\Downloads\\IMG_0370.png"],
  },
};