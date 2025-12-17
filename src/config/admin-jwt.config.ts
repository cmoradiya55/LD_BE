import { registerAs } from '@nestjs/config';

export const adminJwtConfig =  registerAs('adminJwt', () => ({
  secret: process.env.ADMIN_JWT_SECRET,
  accessExpiry: parseInt(process.env.ADMIN_JWT_ACCESS_EXPIRY || '15', 10),
  refreshExpiry: parseInt(process.env.ADMIN_JWT_REFRESH_EXPIRY || '30', 10),
}));