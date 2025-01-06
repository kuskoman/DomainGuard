import { Module } from '@nestjs/common';
import { SslCertificatesService } from './ssl-certificates.service';
import { CrtshModule } from '@src/lib/crtsh/crtsh.module';
import { SslCertificatesRepository } from './ssl-certificates.repository';

@Module({
  providers: [SslCertificatesService, SslCertificatesRepository],
  exports: [SslCertificatesService],
  imports: [CrtshModule],
})
export class SslCertificatesModule {}
