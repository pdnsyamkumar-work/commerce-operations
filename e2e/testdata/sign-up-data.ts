import { Signupdata } from "../utils/interfaces/signup.interface";

export const testData: Record<string, Signupdata> = {
  // Positive Test Data

  user1: {
    full_name: "John Smith",
    work_email: "johnsmith1@test.com",
    companyName: "ABC Store",
    password: "Password@123",
    confirmPassword: "Password@123",
  },

  user2: {
    full_name: "David Miller",
    work_email: "davidmiller1@test.com",
    companyName: "XYZ Mart",
    password: "Password@123",
    confirmPassword: "Password@123",
  },

  user3: {
    full_name: "Josh Butler",
    work_email: "joshbutler1@test.com",
    companyName: "Global Traders",
    password: "Password@123",
    confirmPassword: "Password@123",
  },

  user4: {
    full_name: "William Johnson",
    work_email: "williamjohnson1@test.com",
    companyName: "Prime Retail",
    password: "Password@123",
    confirmPassword: "Password@123",
  },

  user5: {
    full_name: "Robert Wilson",
    work_email: "robertwilson1@test.com",
    companyName: "Mega Supplies",
    password: "Password@123",
    confirmPassword: "Password@123",
  },

  // Negative Test Data

  invalidUser1: {
    full_name: "",
    work_email: "john@test.com",
    companyName: "ABC Store",
    password: "Password@123",
    confirmPassword: "Password@123",
  },

  invalidUser2: {
    full_name: "John Smith",
    work_email: "",
    companyName: "ABC Store",
    password: "Password@123",
    confirmPassword: "Password@123",
  },

  invalidUser3: {
    full_name: "John Smith",
    work_email: "invalidemail",
    companyName: "ABC Store",
    password: "Password@123",
    confirmPassword: "Password@123",
  },

  invalidUser4: {
    full_name: "John Smith",
    work_email: "john@test.com",
    companyName: "",
    password: "Password@123",
    confirmPassword: "Password@123",
  },

  invalidUser5: {
    full_name: "John Smith",
    work_email: "john@test.com",
    companyName: "ABC Store",
    password: "",
    confirmPassword: "",
  },
};
