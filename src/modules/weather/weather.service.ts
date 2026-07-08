import axios from "axios";
import { ReadableStreamDefaultController } from "stream/web";

type OpenWeatherResponse = {
    name: string;
    main: {
        temp: number;
    };
};

export class WeatherService {
    async getCurrentWeather() {
        const apiKey = process.env.WEATHER_API_KEY;
        const city = process.env.WEATHER_CITY || "Waterloo";

        if (!apiKey) {
            throw new Error ("WEATHER_API_KEY is missing");
        }

        const response = await axios.get<OpenWeatherResponse>(
            "https://api.openweathermap.org/data/2.5/weather",
            {
                params:{
                    q: city,
                    appid: apiKey,
                    units: "metric",
                },
            }
        );
        
        return {
            city: response.data.name,
            temperature: response.data.main.temp,
        };
    }
}