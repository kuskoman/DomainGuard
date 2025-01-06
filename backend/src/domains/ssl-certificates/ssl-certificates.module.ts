import { Module } from '@nestjs/common';
import { SslCertificatesService } from './ssl-certificates.service';
import { CrtshModule } from '@src/lib/crtsh/crtsh.module';

@Module({
  providers: [SslCertificatesService],
  exports: [SslCertificatesService],
  imports: [CrtshModule],
})
export class SslCertificatesModule {}
