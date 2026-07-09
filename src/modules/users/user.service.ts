import { EmailService } from "../email/email.service.js";
import { WeatherService } from "../weather/weather.service.js";
import { NewsService } from "../news/news.service.js";

type RegisterUserInput = {
    name: string;
    email: string;
    city: string;
};

export class UserService {
    constructor(
        private emailService: EmailService,
        private weatherService: WeatherService,
        private newService: NewsService
    ) {}
    async registerUser(input: RegisterUserInput) {
        const { name, email, city } = input;

        const user = {
            id: Date.now().toString(),
            name,
            email,
            city,
        };

        const weather = await this.weatherService.getCurrentWeather(city);
        const news = await this.newService.getTopVnExpressNews(10);

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