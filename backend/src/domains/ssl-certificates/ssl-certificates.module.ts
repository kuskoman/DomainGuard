import { Module } from '@nestjs/common';
import { SslCertificatesService } from './ssl-certificates.service';
import { CrtshModule } from '@src/lib/crtsh/crtsh.module';
import { SslCertificatesRepository } from './ssl-certificates.repository';
import { SslCertificatesCronService } from './ssl-certificates-cron.service';
import { NotificationsModule } from '@src/notifications/notifications.module';
import { SslCertificatesController } from './ssl-certificates.controller';

@Module({
  providers: [SslCertificatesService, SslCertificatesRepository, SslCertificatesCronService],
  exports: [SslCertificatesService],
  imports: [CrtshModule, NotificationsModule],
  controllers: [SslCertificatesController],
})
export class SslCertificatesModule {}
