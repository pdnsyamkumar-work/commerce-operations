import { invalidLoginCredentials } from "../../utils/interfaces/signInInterfaces";
import {faker} from "@faker-js/faker";
/*
    Overides will be used to override the default values of the test data.
    Excludes will be used to exclude the default values of the test data.
*/


export class LoginTestData {
  createLoginTestData({overrides={},excludes=[],}:{overrides?: Partial<invalidLoginCredentials>; excludes?:(keyof invalidLoginCredentials)[]}):invalidLoginCredentials{
    const newLoginData:invalidLoginCredentials = {
      email:excludes.includes("email")? " " : faker.internet.email(),
      password:excludes.includes("password")? " " : faker.internet.password(),
    };
     return{
      ...newLoginData,
      ...overrides,
    };
  
  }
}
export const loginTestData = new LoginTestData();

export const loginScenarios = {
  success: loginTestData.createLoginTestData({
    overrides: {
      email: "admin@commerce.test",
      password: "Commerce@123",
    }
  }),
  Invalid_password: loginTestData.createLoginTestData({
    overrides: {
      email: "vishnupriya.a@caw.tech",
      password:faker.internet.password(),
    }
  }),
  Invalid_email_password: loginTestData.createLoginTestData({
    excludes:["password"],
    overrides: {
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  }),

  Empty_Email: loginTestData.createLoginTestData({
    excludes:["email"],
    overrides: {
      email: " ",
      password:"Commerce@123",
    }
  }),
  Empty_Email_password: loginTestData.createLoginTestData({
    excludes:["email","password"],
  }),
};
