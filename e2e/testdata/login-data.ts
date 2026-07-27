export const login_data = [
  {
    email: "admin@commerce.test",
    password: "Commerce@123",
    expected: "success",
  },
  {
    email: "admin@commerce.test",
    password: "",
    expected: "fail",
  },
  {
    email: "",
    password: "",
    expected: "fail",
  },
  {
    email: "",
    password: "Commerce@123",
    expected: "fail",
  },
  {
    email: "admin@commerce.test",
    password: "WrongPassword",
    expected: "fail",
  },
];
