import { beforeEach, describe, expect, vi, it, type Mock } from "vitest";
import { WeatherService } from "../../src/modules/weather/weather.service";
import axios from "axios";
import { afterEach } from "node:test";

vi.mock("axios");

describe("WeatherService", () => {
    let weatherService: WeatherService;

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.WEATHER_API_KEY = "fake-api-key";
        weatherService = new WeatherService();
    });

    afterEach(() => {
        delete process.env.WEATHER_API_KEY;
    });

    it("Should return formatted weather data", async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: {
                name: "Toronto",
                main: {
                    temp: 25.5,
                },
            },
        });

        const result = await weatherService.getCurrentWeather("Toronto");

        expect(result).toEqual({
            city: "Toronto",
            temperature: 25.5,
        });

        expect(axios.get).toHaveBeenCalledOnce();

        expect(axios.get).toHaveBeenCalledWith("https://api.openweathermap.org/data/2.5/weather",
            {
                params: {
                    q: "Toronto",
                    appid: "fake-api-key",
                    units: "metric",
                }
            }
        )

    })

    it("should throw when API key is missing", async () => {
        delete process.env.WEATHER_API_KEY;

        await expect(
            weatherService.getCurrentWeather("Toronto"),
        ).rejects.toThrow("WEATHER_API_KEY is missing");

        expect(axios.get).not.toHaveBeenCalled();
    });

    it("should propagate axios errors", async () => {
        vi.mocked(axios.get).mockRejectedValue(
            new Error("Weather API failed"),
        );

        await expect(
            weatherService.getCurrentWeather("Toronto"),
        ).rejects.toThrow("Weather API failed");

        expect(axios.get).toHaveBeenCalledOnce();
    });
});
