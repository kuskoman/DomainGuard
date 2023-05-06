import { Module } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { DomainsExpirationModule } from './domains-expiration/domains-expiration.module';

@Module({
  providers: [DomainsService],
  imports: [DomainsExpirationModule]
})
export class DomainsModule {}
