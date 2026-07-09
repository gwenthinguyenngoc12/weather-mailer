import { EmailService } from "../email/email.service.js";
import { WeatherService } from "../weather/weather.service.js";
import { NewService } from "../news/news.service.js";

type RegisterUserInput = {
    name: string;
    email: string;
};

export class UserService {
    constructor(
        private emailService: EmailService,
        private weatherService: WeatherService,
        private newService: NewService
    ) {}
    async registerUser(input: RegisterUserInput) {
        const { name, email } = input;

        const user = {
            id: Date.now().toString(),
            name,
            email,
        };

        const weather = await this.weatherService.getCurrentWeather();
        const news = await this.newService.getTOPVNEXpressNews(10);

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