import "dotenv/config";
import { test, expect } from "@playwright/test";
import { NewsService } from "../src/modules/news/news.service.ts";
import { WeatherService } from "../src/modules/weather/weather.service.ts";
import { EmailService } from "../src/modules/email/email.service.ts";



test("Should fetch 10 lastest Vnexpress news, get weather and send email", async ({
    page,
}) => {
    const newsService = new NewsService();
    const receiverEmail = process.env.TEST_RECEIVER_EMAIL;
    const city = process.env.TEST_CITY || "North york";

    expect(receiverEmail, "TEST_RECEIVER_EMAIL is missing in .env").toBeTruthy();


    const weatherService = new WeatherService();
    const emailService = new EmailService();

    const news = await newsService.getTopVnExpressNews(
        page,
        "https://vnexpress.net/",
    );
    await expect(page).toHaveTitle(/VnExpress/);

    const weather = await weatherService.getCurrentWeather(city);

    expect(weather.city).toBeTruthy();
    expect(typeof weather.temperature).toBe("number");

    await emailService.sendWelcomeEmail({
        to: receiverEmail as string,
        name: "Luan",
        temperature: weather.temperature,
        news,
        city: weather.city,
    });

    expect(true).toBeTruthy();
});

test("Should click Sports category, fetch 10 sports news and send email", async ({
    page,
}) => {
    const newsService = new NewsService();
    const receiverEmail = process.env.TEST_RECEIVER_EMAIL;
    const city = process.env.TEST_CITY || "North york";

    expect(receiverEmail, "TEST_RECEIVER_EMAIL is missing in .env").toBeTruthy();


    const weatherService = new WeatherService();
    const emailService = new EmailService();

    await page.goto("https://vnexpress.net/"), {
        waitUntil: "domcontentloaded",
        timeout: 6000,
    }
    await expect(page).toHaveTitle(/VnExpress/);

    await test.step("Click Sports category", async () => {
        const sportsLink = page
            .locator('a[href*="/the-thao"]')
            .first();

        await expect(sportsLink).toBeVisible();
        await Promise.all([
            page.waitForURL(/\/the-thao/, {
                timeout: 6000,
            }),
            sportsLink.click(),
        ]);
    });

    await test.step("Verify Sports page is opened", async () => {
        await expect(page).toHaveURL(/\/the-thao/);
    });

    let sportsNews: Awaited<
        ReturnType<NewsService["extractTop10NewsFromCurrentPage"]>
    > = [];

    await test.step("Fetch top 10 sports news", async () => {
        sportsNews =
            await newsService.extractTop10NewsFromCurrentPage(page);

        console.log("Sports news:", sportsNews);

        expect(sportsNews.length).toBeGreaterThan(0);
        expect(sportsNews.length).toBeLessThanOrEqual(10);

        for (const item of sportsNews) {
            expect(item.title).toBeTruthy();
            expect(item.link).toContain("vnexpress.net");
        }
    });

    await test.step("Get current weather", async () => {
        const weather = await weatherService.getCurrentWeather(city);

        expect(weather.city).toBeTruthy();
        expect(typeof weather.temperature).toBe("number");

        await emailService.sendWelcomeEmail({
            to: receiverEmail as string,
            name: "Luan",
            temperature: weather.temperature,
            news: sportsNews,
            city: weather.city,
        });
    });
});





