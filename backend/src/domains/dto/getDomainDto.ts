import { ApiProperty } from '@nestjs/swagger';
import { Domain } from '@prisma/client';
import { SslCertificateDto } from '../ssl-certificates/dto/ssl-certificate.dto';

export class GetDomainDto implements Domain {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'www.example.com' })
  name!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId!: string;

  @ApiProperty({ type: () => Date, required: false })
  expirationDate: Date | null = null;

  @ApiProperty({ type: () => Date, required: false })
  renewalDate: Date | null = null;

  @ApiProperty({ type: () => Date, required: false })
  lastCheckedAt: Date | null = null;

  @ApiProperty({ type: () => Date })
  createdAt!: Date;

  @ApiProperty({ type: () => Date })
  updatedAt!: Date;

  @ApiProperty({ type: () => [SslCertificateDto] })
  sslCertificates: SslCertificateDto[] = [];
}
