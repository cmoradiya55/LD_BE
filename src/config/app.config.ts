import { registerAs } from "@nestjs/config";

export const appConfig = registerAs('app', () => ({
    env: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.APP_API_PREFIX,
    port: process.env.APP_PORT || 3000,
    corsOrigin: process.env.CORS_ORIGIN,
    name: process.env.APP_NAME || 'Dream Foundation',
    guest_token: process.env.GUEST_TOKEN,
    login_maximum_attempts: parseInt(process.env.LOGIN_MAXIMUM_ATTEMPTS || '5', 10),
    otp_maximum_attempts: parseInt(process.env.OTP_MAXIMUM_ATTEMPTS || '5', 10),
    otp_window_minutes: parseInt(process.env.OTP_WINDOW_MINUTES || '5', 10),
    otp_block_minutes: parseInt(process.env.OTP_BLOCK_MINUTES || '5', 10),
    email_maximum_attempts: parseInt(process.env.EMAIL_MAXIMUM_ATTEMPTS || '5', 10),
    email_window_minutes: parseInt(process.env.EMAIL_WINDOW_MINUTES || '5', 10),
    email_block_minutes: parseInt(process.env.EMAIL_BLOCK_MINUTES || '5', 10),
    auction_url: process.env.AUCTION_URL,
}));