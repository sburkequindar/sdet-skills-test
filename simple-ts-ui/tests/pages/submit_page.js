class SubmitPage {
    constructor(page) {
        this.page = page;
        this.nameInput = 'input[name="name"]';
        this.submitButton = 'button[type="submit"]';
        this.confirmationMessage = '#responseMessage'; // Updated for success messages
        this.errorMessage = '#errorMessage';           // Updated for error messages
    }

    async navigate(url) {
        await this.page.goto(url);
        await this.page.waitForSelector(this.nameInput);
    }

    async submitName(name) {
        await this.page.fill(this.nameInput, name);
        await this.page.click(this.submitButton);
    }

    async getConfirmationMessage() {
        await this.page.waitForSelector(this.confirmationMessage); // Ensure it's visible
        return await this.page.textContent(this.confirmationMessage);
    }

    async getErrorMessage() {
        await this.page.waitForSelector(this.errorMessage); // Ensure it's visible
        return await this.page.textContent(this.errorMessage);
    }
}

module.exports = { SubmitPage };