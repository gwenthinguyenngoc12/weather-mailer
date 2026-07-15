import nodemailer from "nodemailer";
import { welcomeEmailTemplate } from "./email.template";
import type { NewsItem } from "../../types/news.type";


type SendNewsEmailInput = {
    to: string;
    name: string;
    city: string;
    temperature: number;
    news: NewsItem[];
};

export class EmailService {

    async sendWelcomeEmail(input: SendNewsEmailInput,): Promise<void> {
        const { to, name, city, temperature, news } = input;

        if (!process.env.MAIL_HOST) {
            throw new Error("MAIL_HOST is missing");
        }

        if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
            throw new Error("Mail credentials are missing");
        }

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject: "Tin mới nhất từ VnExpress",
            html: welcomeEmailTemplate({
                name,
                city,
                temperature,
                news,
            }),
        });
    }
}