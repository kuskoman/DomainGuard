import { UseGuards, Controller, Get, Param, Post, Logger } from '@nestjs/common';
import { ApiTags, ApiHeader } from '@nestjs/swagger';
import { LoggedGuard } from '@src/auth/guards/logged.guard';
import { SslCertificatesService } from './ssl-certificates.service';

@ApiTags('certificates')
@UseGuards(LoggedGuard)
@ApiHeader({ name: 'Authorization', description: 'JWT received from login endpoint', example: 'Bearer <Token>' })
@Controller('certificates')
export class SslCertificatesController {
  private readonly logger = new Logger(SslCertificatesController.name);
  constructor(private readonly sslCertificatesService: SslCertificatesService) {}

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return await this.sslCertificatesService.findOne(id);
  }

  @Post(':id/refresh')
  public async refresh(@Param('id') id: string) {
    this.sslCertificatesService.refreshCertificateById(id).catch((error) => {
      this.logger.error(`Error refreshing certificate: ${JSON.stringify(error)}`);
    });

    return { message: 'Certificate refresh started' };
  }
}
