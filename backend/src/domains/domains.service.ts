import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { DomainsRepository } from './domains.repository';
import { DomainsExpirationService } from './domains-expiration/domains-expiration.service';
import { CreateDomainInput, FindDomainsByUserInput } from './domains.interfaces';
import { NotificationsService } from '@src/notifications/notifications.service';
import { NotificationTopic } from '@prisma/client';
import { SslCertificatesService } from './ssl-certificates/ssl-certificates.service';

@Injectable()
export class DomainsService {
  private readonly logger = new Logger(DomainsService.name);

  constructor(
    private readonly repository: DomainsRepository,
    private readonly expirationService: DomainsExpirationService,
    private readonly notificationsService: NotificationsService,
    private readonly sslCertificateService: SslCertificatesService,
  ) {}

  public async create(name: string, userId: string) {
    const input: CreateDomainInput = { name, userId };
    const domain = await this.repository.create(input);

    this.logger.log(`Domain created: ${domain.name} (ID: ${domain.id}) for user ${userId}`);

    this.updateDomainExpirationDates(domain.id).catch((error) =>
      this.logger.error(`Error updating domain expiration date: ${JSON.stringify(error)}`),
    );

    this.sslCertificateService
      .updateCertificatesForDomain(domain.id)
      .catch((error) => this.logger.error(`Error updating SSL certificates: ${JSON.stringify(error)}`));

    return domain;
  }

  public async findAllWithUser(userId: string) {
    const input: FindDomainsByUserInput = { userId };
    return this.repository.findAllWithUser(input);
  }

  public async findOneWithUser(id: string, userId: string) {
    return this.findDomainWithUserValidation(id, userId);
  }

  public async removeWithUser(id: string, userId: string) {
    const domain = await this.findDomainWithUserValidation(id, userId);
    this.logger.log(`Removing domain: ${domain.name} (ID: ${id}) for user ${userId}`);
    return this.repository.removeWithUser({ id });
  }

  public async updateDomainExpirationDateWithUser(id: string, userId: string) {
    await this.findDomainWithUserValidation(id, userId);
    return this.updateDomainExpirationDates(id);
  }

  public async findAll() {
    return this.repository.findAll();
  }

  public async findOne(id: string) {
    return this.findDomainWithValidation(id);
  }

  public async remove(id: string) {
    const domain = await this.findDomainWithValidation(id);
    this.logger.log(`Removing domain: ${domain.name} (ID: ${id})`);
    return this.repository.remove({ id });
  }

  public async updateDomainExpirationDates(id: string) {
    const domain = await this.findDomainWithValidation(id);
    const expirationMetadata = await this.expirationService.getExpirationMetadata(domain.name);

    if (!expirationMetadata) {
      await this.notificationsService.createNotification(domain.userId, {
        message: `Error updating expiration date for domain ${domain.name}`,
        topic: NotificationTopic.DOMAIN_EXPIRATION,
      });
      throw new UnprocessableEntityException('Could not get expiration date');
    }

    const updatedDomain = await this.repository.updateExpirationMetadata({ id, ...expirationMetadata });

    this.sslCertificateService
      .updateCertificatesForDomain(domain.id)
      .catch((error) => this.logger.error(`Error updating SSL certificates: ${JSON.stringify(error)}`));

    return updatedDomain;
  }

  private async findDomainWithValidation(id: string) {
    if (!id) {
      throw new UnprocessableEntityException('Id is required');
    }

    const domain = await this.repository.findOne({ id });
    if (!domain) {
      throw new NotFoundException(`Domain with ID ${id} not found`);
    }

    return domain;
  }

  private async findDomainWithUserValidation(id: string, userId: string) {
    if (!id || !userId) {
      throw new UnprocessableEntityException('Id and userId are required');
    }

    const domain = await this.repository.findOneWithUserWithCertificates({ id, userId });
    if (!domain) {
      throw new NotFoundException(`Domain with ID ${id} not found for user ${userId}`);
    }

    return domain;
  }
}
