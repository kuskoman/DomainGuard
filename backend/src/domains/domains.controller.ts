import { Body, Controller, Logger, Post, Get, UseGuards, NotFoundException, Param } from '@nestjs/common';
import { CreateDomainDto } from './dto/createDomainDto';
import { DomainsService } from './domains.service';
import { LoggedGuard } from '@src/auth/guards/logged.guard';
import { UserId } from '@src/auth/decorators/userId.decorator';
import { ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetDomainDto } from './dto/getDomainDto';
import { SslCertificateDto } from './ssl-certificates/dto/ssl-certificate.dto';

@ApiTags('domains')
@UseGuards(LoggedGuard)
@ApiHeader({ name: 'Authorization', description: 'JWT received from login endpoint', example: 'Bearer <Token>' })
@Controller('domains')
export class DomainsController {
  private readonly logger = new Logger(DomainsController.name);

  constructor(private readonly domainsService: DomainsService) {}

  @Post()
  @ApiCreatedResponse({ type: GetDomainDto })
  async create(@Body() { name }: CreateDomainDto, @UserId() userId: string) {
    this.logger.log(`Creating domain ${name}`);
    return await this.domainsService.create(name, userId);
  }

  @Get()
  @ApiOkResponse({ type: [GetDomainDto] })
  async findAll(@UserId() userId: string) {
    this.logger.log(`Getting all domains for user ${userId}`);
    return await this.domainsService.findAllWithUser(userId);
  }

  @Get(':id')
  @ApiOkResponse({ type: GetDomainDto })
  async findOne(@UserId() userId: string, @Param() { id }: { id: string }) {
    this.logger.log(`Getting domain ${id} for user ${userId}`);

    const domain = await this.domainsService.findOneWithUser(id, userId);
    if (!domain || domain.userId !== userId) {
      throw new NotFoundException(`Domain ${id} not found`);
    }

    const sslCertificates = domain.sslCertificates || [];
    const domainWithCertificates = {
      ...domain,
      sslCertificates: sslCertificates.map((cert) => new SslCertificateDto(cert)),
    };

    return domainWithCertificates;
  }

  @Post(':id/refresh')
  async refreshDomainExpirations(@UserId() userId: string, @Param() { id }: { id: string }) {
    this.logger.log(`Refreshing domain ${id} for user ${userId}`);

    return this.domainsService.updateDomainExpirationDateWithUser(id, userId);
  }
}
