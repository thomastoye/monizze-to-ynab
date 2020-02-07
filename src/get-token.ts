import * as puppeteer from "puppeteer";

export const getToken = async (username: string, password: string, headless = true): Promise<string | undefined> => {
    console.error('Launching puppeter...')

    const browser = await puppeteer.launch({ headless });
    const page = await browser.newPage();

    console.error('Opening Monizze login...')
    await page.goto("https://my.monizze.be/nl/login/");

    await page.waitFor("input[name=password]");
    await page.waitFor("input[name=email");

    await page.$eval(
        "input[name=password]",
        (el, value) => ((el as HTMLInputElement).value = value),
        password
    );
    await page.$eval(
        "input[name=email]",
        (el, value) => ((el as HTMLInputElement).value = value),
        username
    );

    console.error('Submitting form...')
    await Promise.all([
        page.$eval("#login-form", form => (form as HTMLFormElement).submit()),
        page.waitForNavigation({ waitUntil: "networkidle2" })
    ]);

    // @ts-ignore
    const token = await page.evaluate(() => axiosHeaderForMonizzeApi["X-Token"]);

    console.error('Closing browser...')
    await browser.close();

    console.error(`Done. Got token ${token}`)
    
    return token
};
