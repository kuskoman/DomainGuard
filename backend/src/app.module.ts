import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { DomainsModule } from './domains/domains.module';
import { DbModule } from './lib/db/db.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EncryptionModule } from './encryption/encryption.module';
import { SessionsModule } from './sessions/sessions.module';
import { RedisModule } from './lib/redis/redis.module';

@Module({
  imports: [
    AppConfigModule,
    HealthModule,
    PrometheusModule.register(),
    DomainsModule,
    DbModule,
    UsersModule,
    AuthModule,
    EncryptionModule,
    RedisModule,
    SessionsModule,
  ],
})
export class AppModule {}
