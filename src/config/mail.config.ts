import { registerAs } from "@nestjs/config";

export const mailConfig = registerAs('mail', () => ({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    from: process.env.MAIL_USER,
    from_name: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASS,
}));