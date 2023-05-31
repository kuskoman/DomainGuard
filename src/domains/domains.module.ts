import { Module } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { DomainsExpirationModule } from './domains-expiration/domains-expiration.module';
import { SslCertificatesModule } from './ssl-certificates/ssl-certificates.module';
import { DomainsController } from './domains.controller';

@Module({
  providers: [DomainsService],
  imports: [DomainsExpirationModule, SslCertificatesModule],
  controllers: [DomainsController],
})
export class DomainsModule {}
