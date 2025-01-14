import { UseGuards, Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiHeader } from '@nestjs/swagger';
import { LoggedGuard } from '@src/auth/guards/logged.guard';
import { SslCertificatesService } from './ssl-certificates.service';

@ApiTags('certificates')
@UseGuards(LoggedGuard)
@ApiHeader({ name: 'Authorization', description: 'JWT received from login endpoint', example: 'Bearer <Token>' })
@Controller('certificates')
export class SslCertificatesController {
  constructor(private readonly sslCertificatesService: SslCertificatesService) {}

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.sslCertificatesService.findOne(id);
  }
}
