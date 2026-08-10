import { SignupData } from "../utils/interfaces/signup.interface";

export const testData: Record<string, SignupData> = {
  // Positive Test Data

  user1: {
    fullName: "John Smith",
    workEmail: "johnsmith1@test.com",
    companyName: "ABC Store",
    password: "Password@123",
    confirmPassword: "Password@123",
  },

  user2: {
    fullName: "David Miller",
    workEmail: "davidmiller1@test.com",
    companyName: "XYZ Mart",
    password: "Password@123",
    confirmPassword: "Password@123",
  },

  user3: {
    fullName: "Josh Butler",
    workEmail: "joshbutler1@test.com",
    companyName: "Global Traders",
    password: "Password@123",
    confirmPassword: "Password@123",
  },

  user4: {
    fullName: "William Johnson",
    workEmail: "williamjohnson1@test.com",
    companyName: "Prime Retail",
    password: "Password@123",
    confirmPassword: "Password@123",
  },

  user5: {
    fullName: "Robert Wilson",
    workEmail: "robertwilson1@test.com",
    companyName: "Mega Supplies",
    password: "Password@123",
    confirmPassword: "Password@123",
  },

  // Negative Test Data

  invalidUser1: {
    fullName: "",
    workEmail: "john@test.com",
    companyName: "ABC Store",
    password: "Password@123",
    confirmPassword: "Password@123",
  },

  invalidUser2: {
    fullName: "John Smith",
    workEmail: "",
    companyName: "ABC Store",
    password: "Password@123",
    confirmPassword: "Password@123",
  },

  invalidUser3: {
    fullName: "John Smith",
    workEmail: "invalidemail",
    companyName: "ABC Store",
    password: "Password@123",
    confirmPassword: "Password@123",
  },

  invalidUser4: {
    fullName: "John Smith",
    workEmail: "john@test.com",
    companyName: "",
    password: "Password@123",
    confirmPassword: "Password@123",
  },

  invalidUser5: {
    fullName: "John Smith",
    workEmail: "john@test.com",
    companyName: "ABC Store",
    password: "",
    confirmPassword: "",
  },
};
