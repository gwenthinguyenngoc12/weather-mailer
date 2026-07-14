import { EmailService } from "../email/email.service.js";
import { WeatherService } from "../weather/weather.service.js";
import { NewsService } from "../news/news.service.js";
import { chromium } from "playwright";

type RegisterUserInput = {
    name: string;
    email: string;
    city: string;
};

export class UserService {
    [x: string]: any;
    constructor(
        private emailService: EmailService,
        private weatherService: WeatherService,
        private newService: NewsService
    ) { }
    async registerUser(input: RegisterUserInput) {
        const { name, email, city } = input;

        const user = {
            name,
            email,
            city,
            createdAt: new Date(),
        };



        const weather = await this.weatherService.getCurrentWeather(city);
        const browser = await chromium.launch({
            headless: true,
        });

        const page = await browser.newPage();

        const news = await this.newsService.getTopVnExpressNews(
            page,
            "https://vnexpress.net/",
        );

        await this.emailService.sendWelcomeEmail({
            to: email,
            name,
            city: weather.city,
            temperature: weather.temperature,
            news,
        });

        return {
            user,
            weather,
            news
        };
    }
}