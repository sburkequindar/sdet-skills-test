const { test, expect } = require("@playwright/test");
const { SubmitPage } = require("./pages/submit_page");

test.use({
    headless: process.env.CI === 'true', 
  });

test.describe("Submit Name Page Tests", () => {
  let page;
  let submitPage;

  
  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    submitPage = new SubmitPage(page);
    await submitPage.navigate("http://127.0.0.1:8080/simple-ts-ui/");
  });

  
  test.afterEach(async () => {
    await page.close();
  });

  test("Should submit a valid name and show confirmation message", async () => {
    const testName = "Dylan";
    await submitPage.submitName(testName);
    const message = await submitPage.getConfirmationMessage();
    expect(message).toBe(`Name submitted successfully: ${testName}`);
  });

  test('Should show error when submitting "Waldo"', async () => {
    const waldoName = "Waldo";
    await submitPage.submitName(waldoName);
    const error = await submitPage.getErrorMessage();
    expect(error).toContain(
      "You aren't Waldo - a real Waldo wouldn't reveal their identity!"
    );
  });

  test("Should show error for empty name submission", async () => {
    await submitPage.submitName(""); 

    // Verify the input triggers required validation using 'validity'
    const inputField = page.locator('input[name="name"]');
    const isInputInvalid = await inputField.evaluate(
      (input) => input.validity.valueMissing
    );
    expect(isInputInvalid).toBeTruthy();

    // Ensure the input field has focus
    const isFocused = await inputField.evaluate(
      (input) => document.activeElement === input
    );
    expect(isFocused).toBeTruthy();
  });

  test("Should show error for whitespace-only name submission", async () => {
    await submitPage.submitName("   "); 
    const error = await submitPage.getErrorMessage();
    expect(error).toContain("Name is required");
  });

  // Skip test for case sensitivity until app is updated
  test.skip('Should be case insensitive for "Waldo"', async () => {
    const waldoVariations = ["WALDO", "waldo", "WalDO", "wAlDo"];

    for (const name of waldoVariations) {
      await submitPage.submitName(name);
      const error = await submitPage.getErrorMessage();
      expect(error).toContain(
        "You aren't Waldo - a real Waldo wouldn't reveal their identity!"
      );
      await submitPage.navigate("http://127.0.0.1:8080/simple-ts-ui/");
    }
  });
});