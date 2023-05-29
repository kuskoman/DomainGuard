import { Module } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { DomainsExpirationModule } from './domains-expiration/domains-expiration.module';
import { SslCertificatesModule } from './ssl-certificates/ssl-certificates.module';

@Module({
  providers: [DomainsService],
  imports: [DomainsExpirationModule, SslCertificatesModule],
})
export class DomainsModule {}
