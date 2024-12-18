import { Module } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { DomainsExpirationModule } from './domains-expiration/domains-expiration.module';
import { SslCertificatesModule } from './ssl-certificates/ssl-certificates.module';
import { DomainsController } from './domains.controller';
import { EncryptionModule } from '@src/encryption/encryption.module';
import { DomainsRepository } from './domains.repository';

@Module({
  providers: [DomainsService, DomainsRepository],
  imports: [DomainsExpirationModule, SslCertificatesModule, EncryptionModule],
  controllers: [DomainsController],
})
export class DomainsModule {}
