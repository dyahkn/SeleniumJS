const { By, Key, Builder, until } = require("selenium-webdriver");
const assert = require("assert");
const { Actions } = require("selenium-webdriver/lib/input");

module.exports = {
  openPage: async (url) => {
    const driver = await new Builder().forBrowser("chrome").build();
    driver.get(url);
    await driver.manage().window().maximize();
    return driver;
  },

  waitForElement: async (driver, selector, timeout = 10000) => {
    return await driver.wait(until.elementLocated(By.css(selector)), timeout);
  },

  clickElement: async (driver, selector) => {
    const elementToClick = await module.exports.waitForElement(
      driver,
      selector
    );
    assert.ok(elementToClick, "Element not found.");
    await elementToClick.click();
  },

  doubleclickElement: async (driver, selector) => {
    const actions = new Actions(driver);

    const elementToClick = await module.exports.waitForElement(
      driver,
      selector
    );
    assert.ok(elementToClick, "Element not found.");
    actions.doubleClick(elementToClick);
  },

  fillText: async (driver, selector, text) => {
    const elementToFill = await module.exports.waitForElement(driver, selector);
    assert.ok(elementToFill, "Element not found.");
    await elementToFill.sendKeys(text);
  },

  clickButton: async (driver, selector, afterText) => {
    const buttons = await driver.findElements(By.css(selector));
    assert.ok(buttons, "Element not found.");
    let index = Math.floor(Math.random() * buttons.length);
    let button = buttons[index];
    await button.click();

    const newButtons = await driver.findElements(By.css(selector));
    const newButton = newButtons[index];
    await module.exports.checkElementTextEquals(driver, newButton, afterText);
  },
  checkElementTextEquals: async (driver, selector, expectedText) => {
    const element =
      typeof selector === "string"
        ? await module.exports.waitForElement(driver, selector)
        : selector;
    assert.ok(element, "Element not found.");
    const actualText = await element.getText();
    assert.strictEqual(
      actualText,
      expectedText,
      `Text does not match: Expected "${expectedText}", Actual "${actualText}"`
    );
  },

  getElementText: async (driver, selector) => {
    const element = await module.exports.waitForElement(driver, selector);
    assert.ok(element, "Element not found.");
    const actualText = await element.getText();
    return actualText;
  },

  checkElementTextContains: async (driver, selector, expectedText) => {
    const element = await module.exports.waitForElement(driver, selector);
    assert.ok(element, "Element not found.");
    const actualText = await element.getText();
    assert.ok(
      actualText.includes(expectedText),
      `Text does not contain: "${expectedText}", Actual text: "${actualText}"`
    );
  },

  deleteTextField: async (driver, selector) => {
    const element = await module.exports.waitForElement(driver, selector);
    assert.ok(element, "Element not found.");
    await element.sendKeys(Key.chord(Key.CONTROL, "a"));
    await element.sendKeys(Key.BACK_SPACE);
  },

  checkJSAlertText: async (alert, expectedText) => {
    const actualText = await alert.getText();
    assert.ok(
      actualText.includes(expectedText),
      `Text does not contain: "${expectedText}", Actual text: "${actualText}"`
    );
  },

  inputTextJSAlert: async (alert, text) => {
    await alert.sendKeys(text);
  },

  confirmJSAlert: async (alert) => {
    await alert.accept();
  },

  dismissJSAlert: async (alert) => {
    await alert.dismiss();
  },
};
