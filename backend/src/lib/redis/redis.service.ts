import { Inject, Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { RedisConfig, redisConfig } from '@src/config/redis.config';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: ReturnType<typeof createClient>;

  constructor(@Inject(redisConfig.KEY) redisConfig: RedisConfig) {
    this.client = createClient(redisConfig);

    this.client.on('connect', () => {
      this.logger.log('Redis connected');
    });

    this.client.on('error', (error) => {
      this.logger.error(error);
    });
  }

  public async onApplicationBootstrap() {
    await this.client.connect();
    this.logger.log('Redis connected');
  }

  public async onApplicationShutdown() {
    await this.client.disconnect();
    this.logger.log('Redis disconnected');
  }

  public getClient() {
    return this.client;
  }

  public async set(key: string, value: string, expirationTime?: number) {
    return this.client.set(key, value, { EX: expirationTime });
  }

  public async get(key: string) {
    return this.client.get(key);
  }

  public async del(key: string) {
    return this.client.del(key);
  }

  public async exists(key: string) {
    return this.client.exists(key);
  }

  public async listKeys(pattern: string) {
    return this.client.keys(pattern);
  }
}
