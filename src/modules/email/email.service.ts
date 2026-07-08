import nodemailer from "nodemailer";
import { welcomeEmailTemplate } from "./email.template";

type SendWelcomeEmailInput = {
    to: string;
    name: string;
    city: string;
    temperature: number;
}

export class EmailService {
    private transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    async sendWelcomeEmail(input: SendWelcomeEmailInput) {
        const { to, name, city, temperature} = input;
        if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
            throw new Error("Mail credentials are missing");
        }

        await this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject: "Welcome to Weather Mailer",
            html: welcomeEmailTemplate({
                name,
                city,
                temperature,
            }),
        });
    }
}