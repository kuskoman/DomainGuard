import { ConfigType, registerAs } from '@nestjs/config';

export const BASE_CONFIG_KEY = 'BASE_CONFIG_KEY';

export const ONE_MONTH = 30 * 24 * 60 * 60;

export const baseConfig = registerAs(BASE_CONFIG_KEY, () => ({
  port: +(process.env.PORT || 3000),
  swaggerEnabled: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
  sessionTime: +(process.env.SESSION_TIME || ONE_MONTH),
}));

export type BaseConfig = ConfigType<typeof baseConfig>;
