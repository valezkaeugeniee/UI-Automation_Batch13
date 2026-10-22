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

    beforeEach(async function () {
        driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(new chrome.Options())
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

    // TEST CASE 1: LOGIN
    it("Fitur Login - Berhasil Login dengan Data Valid", async function () {
        await login();

        // Assertion 1
        const currentUrl = await driver.getCurrentUrl();
        assert.ok(currentUrl.includes("/users"), `URL tidak sesuai setelah login: ${currentUrl}`);

        // Assertion 2
        const headerListUsers = await driver.wait(
            until.elementLocated(By.xpath("//*[text()[contains(., 'List Users')]]")),
            10000
        );
        assert.ok(await headerListUsers.isDisplayed(), "Header List Users tidak terlihat");
    });

    // --- TEST CASE 2: ADD USER ---
    it("Fitur Add User - Berhasil Menambahkan User Baru", async function () {
        await login();

        const addBtn = await driver.wait(
            until.elementLocated(By.xpath("//button[contains(.,'Add')] | //a[contains(.,'Add')]")),
            10000
        );
        await addBtn.click();
        await driver.wait(until.urlContains("/add"), 10000);

        // Assertion 1
        const addUrl = await driver.getCurrentUrl();
        assert.ok(addUrl.includes("/add"), `Bukan di halaman Add User: ${addUrl}`);

        // Data random
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
        await ageInput.sendKeys(randomAge.toString());

        // Assertion 2
        assert.strictEqual(await addUsernameInput.getAttribute("value"), randomUsername, "Username tidak terisi dengan benar");
        assert.strictEqual(await ageInput.getAttribute("value"), randomAge.toString(), "Age tidak terisi dengan benar");

        const submitBtn = await driver.findElement(By.xpath("//button[contains(text(),'Submit')]"));
        await submitBtn.click();

        const listNavBtn = await driver.wait(
            until.elementLocated(By.xpath("//button[contains(.,'List') or contains(.,'list')]")),
            10000
        );
        await listNavBtn.click();
        await driver.wait(until.urlContains("/users"), 10000);

        // Assertion 3
        const newUserElement = await driver.wait(
            until.elementLocated(By.xpath(`//*[text()[contains(., '${randomUsername}')]]`)),
            10000,
            `User ${randomUsername} tidak muncul di list`
        );
        assert.ok(await newUserElement.isDisplayed(), `User ${randomUsername} tidak terlihat di list`);
    });
});