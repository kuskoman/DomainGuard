import { Injectable, Logger } from '@nestjs/common';
import { SslCertificatesRepository } from './ssl-certificates.repository';
import { SslCertificatesService } from './ssl-certificates.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SslCertificatesCronService {
  private readonly logger = new Logger(SslCertificatesCronService.name);

  constructor(
    private readonly sslCertificatesService: SslCertificatesService,
    private readonly sslCertificatesRepository: SslCertificatesRepository,
  ) {}

  @Cron('0 1/2 * * *') // At minute 0 past every 2nd hour from 1 through 23.”
  public async updateAllCertificates() {
    this.logger.log('Updating SSL certificates');
    const allDomains = await this.sslCertificatesRepository.findAllDomains();
    this.logger.log(`Updating SSL certificates for ${allDomains.length} domains`);

    for (const domain of allDomains) {
      this.logger.log(`Updating SSL certificates for domain: ${domain.name} (ID: ${domain.id})`);
      await this.sslCertificatesService.findAndInsertCertificatesForDomain(domain.id);
      this.logger.log(`Finished updating SSL certificates for domain: ${domain.name} (ID: ${domain.id})`);
      await this.sslCertificatesService.updateCertificateExpirationDatesForDomain(domain);
    }

    this.logger.log('Finished updating SSL certificates');

    return allDomains.length;
  }
}
