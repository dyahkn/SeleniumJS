require("dotenv").config();
const config = require("../config");
const {
  openPage,
  clickElement,
  fillText,
  checkElementTextEquals,
  deleteTextField,
} = require("../helper/helper");
const url = process.env.BASE_URL;
let driver;
const userName = "#user-name";
const password = "#password";
const buttonLogin = "#login-button";
const errorMessage = ".error-message-container.error";

describe("Login to Swag Labs using correct user", function () {
  this.beforeEach(async () => {
    driver = await openPage(url);
  });

  it("User cannot login using empty password or user", async function () {
    //Empty username and password
    await clickElement(driver, buttonLogin);
    await checkElementTextEquals(
      driver,
      errorMessage,
      "Epic sadface: Username is required"
    );

    //Empty username
    await fillText(driver, password, config.password);
    await clickElement(driver, buttonLogin);
    await checkElementTextEquals(
      driver,
      errorMessage,
      "Epic sadface: Username is required"
    );

    //Empty password
    await fillText(driver, userName, config.users.standardUser);
    await deleteTextField(driver, password);
    await clickElement(driver, buttonLogin);
    await checkElementTextEquals(
      driver,
      errorMessage,
      "Epic sadface: Password is required"
    );
  });

  it("User cannot login using locked user", async function () {
    await fillText(driver, userName, config.users.lockedOutUser);
    await fillText(driver, password, config.password);
    await clickElement(driver, buttonLogin);
    await checkElementTextEquals(
      driver,
      errorMessage,
      "Epic sadface: Sorry, this user has been locked out."
    );
  });
  it("User successfully login using correct password and user", async function () {
    const pageTitle = ".app_logo";
    await fillText(driver, userName, config.users.standardUser);
    await fillText(driver, password, config.password);
    await clickElement(driver, buttonLogin);
    await checkElementTextEquals(driver, pageTitle, "Swag Labs");
  });

  afterEach(async () => {
    await driver.quit();
  });
});
