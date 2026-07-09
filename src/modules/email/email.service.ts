import nodemailer from "nodemailer";
import { welcomeEmailTemplate } from "./email.template";

type NewsItem = {
    title: string;
    link: string;
};

type SendWelcomeEmailInput = {
    to: string;
    name: string;
    city: string;
    temperature: number;
    news: NewsItem[];
};

export class EmailService {
    async sendWelcomeEmail(input: SendWelcomeEmailInput) {
        const { to, name, city, temperature, news } = input;

        if (!process.env.MAIL_HOST) {
            throw new Error("MAIL_HOST is missing");
        }

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject: "Welcome to Weather Mailer",
            html: welcomeEmailTemplate({
                name,
                city,
                temperature,
                news,
            }),
        });
    }
}