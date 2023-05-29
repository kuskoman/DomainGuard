import { Module } from '@nestjs/common';
import { SslCertificatesService } from './ssl-certificates.service';

@Module({
  providers: [SslCertificatesService],
})
export class SslCertificatesModule {}
