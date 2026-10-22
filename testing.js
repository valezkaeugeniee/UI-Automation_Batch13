const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const assert = require("assert");
const fs = require("fs");

describe("Web UI Automation - Belajar Bareng", function () {
    this.timeout(60000);
    let driver;

    async function login(username = "admin", password = "admin") {
    const usernameInput = await driver.wait(
        until.elementLocated(By.xpath("//input[@placeholder='Username' or @type='text' or @name='username']")),
        20000
    );
    await usernameInput.sendKeys(username);

    const passwordInput = await driver.findElement(
        By.xpath("//input[@placeholder='Password' or @type='password' or @name='password']")
    );
    await passwordInput.sendKeys(password);

    const signInBtn = await driver.findElement(
        By.xpath("//button[contains(text(),'Sign in') or contains(text(),'Sing in')]")
    );
    await signInBtn.click();

    await driver.wait(until.urlContains("/users"), 15000);
    }

    async function bodyContains(text, timeout = 15000) {
    const body = await driver.findElement(By.css("body"));
    await driver.wait(until.elementTextContains(body, text), timeout);
    }

    beforeEach(async function () {
    const options = new chrome.Options();

    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    await driver.manage().window().maximize();
    await driver.get("https://belajar-bareng.onrender.com/");
    });

    afterEach(async function () {
    if (driver) {
        if (this.currentTest.state === "failed") {
        const img = await driver.takeScreenshot();
        const name = this.currentTest.title.replace(/[^a-z0-9]/gi, "_");
        fs.writeFileSync(`fail_${name}.png`, img, "base64");
        }
        await driver.quit();
    }
    });

    // test cases
    it("1. Fitur Login - Berhasil Login dengan Data Valid", async function () {
    await login();

    const currentUrl = await driver.getCurrentUrl();
    assert.ok(currentUrl.includes("/users"), "URL tidak sesuai setelah login");

    const headerListUsers = await driver.wait(
        until.elementLocated(By.xpath("//*[contains(., 'List Users')]")),
        10000
    );
    assert.ok(await headerListUsers.isDisplayed(), "Header List Users tidak terlihat");
    });

    it("2. Fitur Add User - Berhasil Menambahkan User Baru", async function () {
    await login();

    // halaman Add User
    const addBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(.,'Add')] | //a[contains(.,'Add')]")),
        10000
    );
    await addBtn.click();
    await driver.wait(until.urlContains("/add"), 10000);
    
    const listNames = ["Alex", "Budi", "Chandra", "David", "Eka", "Fajar", "Gilang", "Indra", "Joko"];
    const randomNamePrefix = listNames[Math.floor(Math.random() * listNames.length)];
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const randomUsername = `${randomNamePrefix}_${randomNum}`;
    const randomAge = Math.floor(Math.random() * 30) + 18;

    const addUsernameInput = await driver.wait(
until.elementLocated(By.xpath("//input[@placeholder='Username']")), 10000
    );
    await addUsernameInput.sendKeys(randomUsername);

    const ageInput = await driver.findElement(By.xpath("//input[@placeholder='Age']"));
    await ageInput.sendKeys(randomAge.toString());})})