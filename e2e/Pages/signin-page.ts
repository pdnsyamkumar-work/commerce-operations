import { Page, Locator } from "@playwright/test";
import { signin } from "../utils/interfaces/signin.interface";

export class SigninPage {
  page: Page;
  Emailaddress: Locator;
  Password: Locator;
  signinBtn: Locator;
  Dashboard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.Emailaddress = page.getByRole("textbox", { name: "email" });
    this.Password = page.getByLabel("Password *");
    this.signinBtn = page.locator("//button[text()='Sign In']");
    this.Dashboard = page.locator("text=Dashboard");
  }

  async navigate() {
    await this.page.goto("http://localhost:3000/");
  }

  async filllogin(data: signin) {
    await this.Emailaddress.fill(data.Emailaddress);
    await this.Password.fill(data.Password);
    await this.signinBtn.click();
  }

  async clickSigninButton() {
    await this.signinBtn.click();
  }
  async waitforsigninresponse() {
    return await this.page.waitForResponse(
      (response) =>
        response.url().includes("/auth/login") &&
        response.request().method() === "POST",
    );
  }
}
