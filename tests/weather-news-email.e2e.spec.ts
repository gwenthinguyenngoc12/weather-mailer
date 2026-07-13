import "dotenv/config";
import {test, expect} from "@playwright/test";
import {NewsService} from "../src/modules/news/news.service.ts";
import {WeatherService} from "../src/modules/weather/weather.service.ts";
import {EmailService} from "../src/modules/email/email.service.ts";

test("Should fetch 10 lastest Vnexpress news, get weather and send email", async () =>{
    const receiverEmail = process.env.TEST_RECEIVER_EMAIL;
    const city = process.env.TEST_CITY || "North york";

    expect (receiverEmail, "TEST_RECEIVER_EMAIL is missing in .env"). toBeTruthy();

    const newsService = new NewsService();
    const weatherService = new WeatherService();
    const emailService = new EmailService();

    const news = await newsService.getTopVnExpressNews(10);

    expect(news.length).toBeGreaterThan(0);
    expect(news.length).toBeLessThanOrEqual(10);

    for (const item of news) {
        expect(item.title).toBeTruthy();
        expect(item.link).toContain("vnexpress.net");

    }

    const weather = await weatherService.getCurrentWeather(city);

    expect (weather.city).toBeTruthy();
    expect(typeof weather.temperature).toBe("number");

    await emailService.sendWelcomeEmail({
        to: receiverEmail as string,
        name: "Luan",
        temperature: weather.temperature,
        news,
        city:weather.city,
    });

    expect(true).toBeTruthy();
});



