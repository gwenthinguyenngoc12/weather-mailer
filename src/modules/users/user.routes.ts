import { Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { EmailService } from "../email/email.service";
import { WeatherService } from "../weather/weather.service";
import { NewsService } from "../news/news.service";

const router = Router();

const emailService = new EmailService();
const weatherService = new WeatherService();
const newsService = new NewsService();

const userService = new UserService(emailService, weatherService, newsService);
const userController = new UserController(userService);

router.post("/register", userController.register);

export {router as userRoutes}
