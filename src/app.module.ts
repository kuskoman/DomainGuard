import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { DomainsModule } from './domains/domains.module';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AppConfigModule, HealthModule, PrometheusModule.register(), DomainsModule, DbModule, UsersModule],
})
export class AppModule {}
