import { ConfigType, registerAs } from '@nestjs/config';
import { requiredEnv } from './helpers/requiredEnv';

export const BASE_CONFIG_KEY = 'BASE_CONFIG_KEY';

export const baseConfig = registerAs(BASE_CONFIG_KEY, () => ({
  port: +(process.env.PORT || 3000),
  swaggerEnabled: process.env.NODE_ENV !== 'production',
  jwtSecret: requiredEnv('JWT_SECRET'),
}));

export type BaseConfig = ConfigType<typeof baseConfig>;
