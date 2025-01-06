import { ApiProperty } from '@nestjs/swagger';
import { SslCertificate } from '@prisma/client';

export class SslCertificateDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  hostname: string;

  @ApiProperty({ nullable: true, type: Date })
  expirationDate: Date | null;

  @ApiProperty({ nullable: true, type: Date })
  lastCheckedAt: Date | null;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  constructor(cert: SslCertificate) {
    this.id = cert.id;
    this.hostname = cert.hostname;
    this.expirationDate = cert.expirationDate;
    this.lastCheckedAt = cert.lastCheckedAt;
    this.createdAt = cert.createdAt;
    this.updatedAt = cert.updatedAt;
  }
}
