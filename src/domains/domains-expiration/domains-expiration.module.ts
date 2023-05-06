import { Module } from '@nestjs/common';
import { DomainsExpirationService } from './domains-expiration.service';

@Module({
  providers: [DomainsExpirationService],
  exports: [DomainsExpirationService],
})
export class DomainsExpirationModule {}
