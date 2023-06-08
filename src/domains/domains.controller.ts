import { Body, Controller, Logger, Post, Get, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { CreateDomainDto } from './dto/createDomainDto';
import { DomainsService } from './domains.service';
import { LoggedGuard } from '@src/auth/guards/logged.guard';
import { UserId } from '@src/auth/decorators/userId.decorator';

@Controller('domains')
export class DomainsController {
  private readonly logger = new Logger(DomainsController.name);

  constructor(private readonly domainsService: DomainsService) {}

  // todo: create a decorator for getting user from request
  @UseGuards(LoggedGuard)
  @Post()
  create(@Body() { name }: CreateDomainDto, @UserId() userId: string) {
    this.logger.log(`Creating domain ${name}`);
    return this.domainsService.create(name, userId);
  }

  @UseGuards(LoggedGuard)
  @Get()
  findAll(@Req() req: Request & { userId: string }) {
    this.logger.log(`Getting all domains for user ${req.userId}`);
    return this.domainsService.findAllWithUser(req.userId);
  }

  @UseGuards(LoggedGuard)
  @Get(':id')
  async findOne(@Req() req: Request & { userId: string }, @Body() { id }: { id: string }) {
    this.logger.log(`Getting domain ${id} for user ${req.userId}`);
    const domain = await this.domainsService.findOneWithUser(id, req.userId);
    if (!domain || domain.userId !== req.userId) {
      throw new NotFoundException(`Domain ${id} not found`);
    }

    return domain;
  }

  @UseGuards(LoggedGuard)
  @Post(':id/refresh')
  async refreshDomainExpiration(@Req() req: Request & { userId: string }, @Body() { id }: { id: string }) {
    this.logger.log(`Refreshing domain ${id} for user ${req.userId}`);
    const domain = await this.domainsService.findOneWithUser(id, req.userId);
    if (!domain || domain.userId !== req.userId) {
      throw new NotFoundException(`Domain ${id} not found`);
    }

    return this.domainsService.updateDomainExpirationDateWithUser(id, req.userId);
  }
}
