import { Module } from '@nestjs/common';
import { SslCertificatesService } from './ssl-certificates.service';
import { CrtshModule } from '@src/lib/crtsh/crtsh.module';
import { SslCertificatesRepository } from './ssl-certificates.repository';
import { SslCertificatesCronService } from './ssl-certificates-cron.service';
import { NotificationsModule } from '@src/notifications/notifications.module';

@Module({
  providers: [SslCertificatesService, SslCertificatesRepository, SslCertificatesCronService],
  exports: [SslCertificatesService],
  imports: [CrtshModule, NotificationsModule],
})
export class SslCertificatesModule {}
