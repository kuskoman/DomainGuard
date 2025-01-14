import { Injectable, Logger } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { DomainsRepository } from './domains.repository';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class DomainsCronService {
  private readonly logger = new Logger(DomainsCronService.name);

  constructor(
    private readonly domainsService: DomainsService,
    private readonly domainsRepository: DomainsRepository,
  ) {}

  @Cron('0 12 * * *') // Every day at 12:00
  public async updateAllDomains() {
    this.logger.log('Updating domains');
    const allDomains = await this.domainsRepository.findAll();
    this.logger.log(`Updating ${allDomains.length} domains`);

    for (const domain of allDomains) {
      this.logger.log(`Updating domain: ${domain.name} (ID: ${domain.id})`);
      await this.domainsService.updateDomainExpirationDates(domain.id);
      this.logger.log(`Finished updating domain: ${domain.name} (ID: ${domain.id})`);
    }

    this.logger.log('Finished updating domains');
    return allDomains.length;
  }
}
