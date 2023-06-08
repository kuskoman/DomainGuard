import { Body, Controller, Logger, Post, Get, UseGuards, NotFoundException } from '@nestjs/common';
import { CreateDomainDto } from './dto/createDomainDto';
import { DomainsService } from './domains.service';
import { LoggedGuard } from '@src/auth/guards/logged.guard';
import { UserId } from '@src/auth/decorators/userId.decorator';

@Controller('domains')
export class DomainsController {
  private readonly logger = new Logger(DomainsController.name);

  constructor(private readonly domainsService: DomainsService) {}

  @UseGuards(LoggedGuard)
  @Post()
  create(@Body() { name }: CreateDomainDto, @UserId() userId: string) {
    this.logger.log(`Creating domain ${name}`);
    return this.domainsService.create(name, userId);
  }

  @UseGuards(LoggedGuard)
  @Get()
  findAll(@UserId() userId: string) {
    this.logger.log(`Getting all domains for user ${userId}`);
    return this.domainsService.findAllWithUser(userId);
  }

  @UseGuards(LoggedGuard)
  @Get(':id')
  async findOne(@UserId() userId: string, @Body() { id }: { id: string }) {
    this.logger.log(`Getting domain ${id} for user ${userId}`);
    const domain = await this.domainsService.findOneWithUser(id, userId);
    if (!domain || domain.userId !== userId) {
      throw new NotFoundException(`Domain ${id} not found`);
    }

    return domain;
  }

  @UseGuards(LoggedGuard)
  @Post(':id/refresh')
  async refreshDomainExpiration(@UserId() userId: string, @Body() { id }: { id: string }) {
    this.logger.log(`Refreshing domain ${id} for user ${userId}`);
    const domain = await this.domainsService.findOneWithUser(id, userId);
    if (!domain || domain.userId !== userId) {
      throw new NotFoundException(`Domain ${id} not found`);
    }

    return this.domainsService.updateDomainExpirationDateWithUser(id, userId);
  }
}
