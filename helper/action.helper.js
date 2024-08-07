const {
  clickElement,
  fillText,
  checkElementTextEquals,
} = require("../helper/helper");

module.exports = {
  userLogin: async (driver, username, password) => {
    await fillText(driver, "#user-name", username);
    await fillText(driver, "#password", password);
    await clickElement(driver, "#login-button");
    await checkElementTextEquals(driver, ".app_logo", "Swag Labs");
  },
};
