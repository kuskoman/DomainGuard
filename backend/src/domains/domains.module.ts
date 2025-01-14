import { Module } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { DomainsExpirationModule } from './domains-expiration/domains-expiration.module';
import { SslCertificatesModule } from './ssl-certificates/ssl-certificates.module';
import { DomainsController } from './domains.controller';
import { EncryptionModule } from '@src/encryption/encryption.module';
import { DomainsRepository } from './domains.repository';
import { NotificationsModule } from '@src/notifications/notifications.module';
import { DomainsCronService } from './domains.cron.service';

@Module({
  providers: [DomainsService, DomainsRepository, DomainsCronService],
  imports: [DomainsExpirationModule, SslCertificatesModule, EncryptionModule, NotificationsModule],
  controllers: [DomainsController],
})
export class DomainsModule {}
