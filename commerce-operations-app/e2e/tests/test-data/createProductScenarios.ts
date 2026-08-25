import { createProductElements } from "../../utils/interfaces/createProductInterface";
import {faker} from "@faker-js/faker";

const IMAGE_PATH = "C:\\Users\\caw-qa\\Downloads\\flower.jpeg";
const generateProductCode = (): string => {
  return `PRD-${Date.now()}`;
};
export class CreateProductTestData {
  createProductTestData({overrides={},excludes=[],}:{overrides?: Partial<createProductElements>; excludes?:(keyof createProductElements)[];}={},):createProductElements{
    const createProductData:createProductElements = {
      productName:excludes.includes("productName")? " " : faker.commerce.productName(),
      productCode:excludes.includes("productCode")? " " : generateProductCode(),
      category:excludes.includes("category")? " " :  faker.commerce.department(),
    price:excludes.includes("price")? " " : faker.commerce.price({min:10,max:1000,dec:2}),
    stock:excludes.includes("stock")? " " : faker.number.int({ min: 1, max: 100 }).toString(),
    status:excludes.includes("status")? " " : "Active",
    imagePaths:excludes.includes("imagePaths")? [] : [IMAGE_PATH],
    };
    return {...createProductData, ...overrides};
  }
}
export const createProductTestData = new CreateProductTestData();
export const createProductAllScenarios={
    Succssfull_Product_Creation: createProductTestData.createProductTestData(),

    Product_Creation_With_Duplicate_ProductCode: 
      createProductTestData.createProductTestData({
        overrides: {
          productCode: "PRD-119",
    },
  }),
    Product_Creation_Without_ProductName: 
      createProductTestData.createProductTestData({
        overrides: {
          productName: "",
        }
      }),
    Product_Creation_Without_ProductCode: 
      createProductTestData.createProductTestData({
        overrides: {
          productCode: " ",
        }
      }),
 
    Product_Creation_Without_Category: 
      createProductTestData.createProductTestData({
      overrides: {
        category: " ",
      },
    }),
    Product_Creation_Without_Price: 
      createProductTestData.createProductTestData({
        overrides: {
          price: " ",
        }
      }),
   
    Product_Creation_With_ProductName_lessthan3Char: 
       createProductTestData.createProductTestData({
      overrides: {
        productName: "w",
      },
    }),

    Product_Creation_With_SpecialChars_InProductCode: 
      createProductTestData.createProductTestData({
      overrides: {
        productCode: "PRD=119",
      },
    }),

    Product_Creation_WithCategory_Lessthan_2Char: 
       createProductTestData.createProductTestData({
      overrides: {
        category: "H",
      },
    }),
    Product_Creation_With_MoreThan_6Images: 
    createProductTestData.createProductTestData({
      overrides: {
        imagePaths: [
          IMAGE_PATH,
          IMAGE_PATH,
          IMAGE_PATH,
          IMAGE_PATH,
          IMAGE_PATH,
          IMAGE_PATH,
          IMAGE_PATH,
        ],
      },
    }),
  };
