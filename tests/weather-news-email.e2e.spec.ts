import "dotenv/config";
import { test, expect } from "@playwright/test";
import { NewsService } from "../src/modules/news/news.service.ts";
import { WeatherService } from "../src/modules/weather/weather.service.ts";
import { EmailService } from "../src/modules/email/email.service.ts";
import type { NewsItem } from "../src/types/news.type.ts";



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
    page, context
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
        const sportsLink = page.getByRole("link", {
            name: "Thể thao",
        }).first();

        await expect(sportsLink).toBeVisible({
            timeout: 3000,
        });

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

    let sportsNews: NewsItem[] = [];

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

    let weatherCity = "North York";
    let temperature = 0;

    await test.step(
        "Get weather from The Weather Network",
        async () => {
            const weatherPage = await context.newPage();

            await weatherPage.goto(
                "https://www.theweathernetwork.com/en/city/ca/ontario/north-york/current",
                {
                    waitUntil: "domcontentloaded",
                    timeout: 60000,
                },
            );

            await weatherPage.waitForLoadState("domcontentloaded");

            await expect(weatherPage).toHaveTitle(
                /North York.*Current Weather/i,
            );

            const weatherData = await weatherPage.evaluate(() => {
                const bodyText = document.body.innerText;

                const cityMatch = bodyText.match(
                    /North York,\s*ON/i,
                );

                const temperatureMatch =
                    bodyText.match(
                        /North York,\s*ON[\s\S]*?Updated.*?\n\s*(-?\d+)\s*\n\s*°C/i,
                    ) ??
                    bodyText.match(
                        /current temperature in North York\?\s*(-?\d+)\s*°/i,
                    );

                const feelsLikeMatch =
                    bodyText.match(/Feels\s*(-?\d+)/i);

                const conditionMatch =
                    bodyText.match(
                        /°C\s*\n\s*([A-Za-z][A-Za-z\s]+?)\s*\n\s*Feels/i,
                    );

                return {
                    city: cityMatch?.[0] ?? "North York, ON",
                    temperature: temperatureMatch
                        ? Number(temperatureMatch[1])
                        : Number.NaN,
                    feelsLike: feelsLikeMatch
                        ? Number(feelsLikeMatch[1])
                        : undefined,
                    condition:
                        conditionMatch?.[1]?.trim() ?? "",
                };
            });

            expect(
                Number.isNaN(weatherData.temperature),
                "Không lấy được nhiệt độ từ The Weather Network",
            ).toBeFalsy();

            weatherCity = weatherData.city;
            temperature = weatherData.temperature;

            console.log("Weather data:", weatherData);

            await weatherPage.close();
        },
    );

    await test.step("Send email", async () => {
        await emailService.sendWelcomeEmail({
            to: receiverEmail as string,
            name: "Luan",
            city: weatherCity,
            temperature,
            news: sportsNews,
        });
    });
});





