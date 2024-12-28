import { ConfigType, registerAs } from '@nestjs/config';
import { requiredEnv } from './helpers/requiredEnv';
import { createClient } from 'redis';

export const REDIS_CONFIG_KEY = 'REDIS_CONFIG_KEY';

type RedisInternalConfig = Parameters<typeof createClient>[0];

export const redisConfig = registerAs(REDIS_CONFIG_KEY, () => {
  const redisConfig: RedisInternalConfig = {
    url: requiredEnv('REDIS_URL'),
  };

  return redisConfig;
});

export type RedisConfig = ConfigType<typeof redisConfig>;
