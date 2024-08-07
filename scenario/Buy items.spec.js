require("dotenv").config();
const config = require("../config");
const assert = require("assert");

const {
  openPage,
  clickButton,
  clickElement,
  fillText,
  checkElementTextEquals,
  getElementText,
} = require("../helper/helper");
const { userLogin } = require("../helper/action.helper");
const { faker } = require("@faker-js/faker");
const url = process.env.BASE_URL;
let driver;

describe("Login to Swag Labs using correct user", function () {
  this.beforeAll(async () => {
    driver = await openPage(url);
    await userLogin(driver, config.users.standardUser, config.password);
  });

  it("User successfully add an item and complete transaction", async function () {
    //Add an items to cart and get items name
    await clickButton(driver, ".btn_inventory", "Remove");
    await clickElement(driver, "#shopping_cart_container");
    const itemName = await getElementText(driver, ".inventory_item_name");
    await clickElement(driver, "#checkout");

    //Fill user data
    await fillText(driver, "#first-name", faker.person.firstName());
    await fillText(driver, "#last-name", faker.person.lastName());
    await fillText(
      driver,
      "#postal-code",
      faker.datatype.number({ min: 1000, max: 5000 })
    );
    await clickElement(driver, "#continue");

    // Verify final items name
    const finalItemName = await getElementText(driver, ".inventory_item_name");
    assert.equal(finalItemName, itemName);
    await clickElement(driver, "#finish");

    //Verify order success
    await checkElementTextEquals(
      driver,
      ".complete-header",
      "Thank you for your order!"
    );
  });

  this.afterAll(async () => {
    await driver.quit();
  });
});
