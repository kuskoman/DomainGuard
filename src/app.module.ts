import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { DomainsModule } from './domains/domains.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [AppConfigModule, HealthModule, PrometheusModule.register(), DomainsModule, DbModule],
})
export class AppModule {}
