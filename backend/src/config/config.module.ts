import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { baseConfig } from './base.config';
import { redisConfig } from './redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [baseConfig, redisConfig],
      isGlobal: true,
      ignoreEnvFile: false,
      cache: true,
    }),
  ],
})
export class AppConfigModule {}
