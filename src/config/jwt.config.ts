import { registerAs } from '@nestjs/config';

export const customerJwtConfig =  registerAs('customerJwt', () => ({
  secret: process.env.JWT_SECRET,
  accessExpiry: parseInt(process.env.JWT_ACCESS_EXPIRY || '15', 10),
  refreshExpiry: parseInt(process.env.JWT_REFRESH_EXPIRY || '30', 10),
  maxDevices: parseInt(process.env.MAX_DEVICES_PER_USER || '5', 10),
}));