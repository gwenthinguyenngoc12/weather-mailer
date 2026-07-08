import { EmailService } from "../email/email.service";
import { WeatherService } from "../weather/weather.service";

type RegisterUserInput = {
    name: string;
    email: string;
};

export class UserService {
    constructor(
        private emailService: EmailService,
        private weatherService: WeatherService
    ) { }
    async registerUser(input: RegisterUserInput) {
        const { name, email } = input;

        const user = {
            id: Date.now().toString(),
            name,
            email,
        };

        const weather = await this.weatherService.getCurrentWeather();

        await this.emailService.sendWelcomeEmail({
            to: email,
            name,
            city: weather.city,
            temperature: weather.temperature,
        });

        return {
            user,
            weather,
        };
    }
}