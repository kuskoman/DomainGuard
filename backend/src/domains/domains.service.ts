import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { DomainsRepository } from './domains.repository';
import { DomainsExpirationService } from './domains-expiration/domains-expiration.service';
import { CreateDomainInput, FindDomainsByUserInput } from './domains.interfaces';
import { NotificationsService } from '@src/notifications/notifications.service';
import { Domain, NotificationTopic } from '@prisma/client';
import { SslCertificatesService } from './ssl-certificates/ssl-certificates.service';

const SEVEN_DAYS = 60 * 60 * 24 * 7 * 1000;
const THIRTY_DAYS = 60 * 60 * 24 * 30 * 1000;

@Injectable()
export class DomainsService {
  private readonly logger = new Logger(DomainsService.name);
  private readonly NOTIFICATION_THRESHOLD = SEVEN_DAYS;
  private readonly EXPIRATION_THRESHOLD = THIRTY_DAYS;

  constructor(
    private readonly domainsRepository: DomainsRepository,
    private readonly expirationService: DomainsExpirationService,
    private readonly notificationsService: NotificationsService,
    private readonly sslCertificateService: SslCertificatesService,
  ) {}

  public async create(name: string, userId: string) {
    const input: CreateDomainInput = { name, userId };
    const domain = await this.domainsRepository.create(input);

    this.logger.log(`Domain created: ${domain.name} (ID: ${domain.id}) for user ${userId}`);

    this.updateDomainExpirationDates(domain.id).catch((error) =>
      this.logger.error(`Error updating domain expiration date: ${JSON.stringify(error)}`),
    );

    this.refreshDomainCertificates(domain).catch((error) =>
      this.logger.error(`Error updating SSL certificates: ${JSON.stringify(error)}`),
    );

    return domain;
  }

  public async findAllWithUser(userId: string) {
    const input: FindDomainsByUserInput = { userId };
    return this.domainsRepository.findAllWithUser(input);
  }

  public async findOneWithUser(id: string, userId: string) {
    return this.findDomainWithUserValidation(id, userId);
  }

  public async removeWithUser(id: string, userId: string) {
    const domain = await this.findDomainWithUserValidation(id, userId);
    this.logger.log(`Removing domain: ${domain.name} (ID: ${id}) for user ${userId}`);
    return this.domainsRepository.removeWithUser({ id });
  }

  public async updateDomainExpirationDateWithUser(id: string, userId: string) {
    await this.findDomainWithUserValidation(id, userId);
    return this.updateDomainExpirationDates(id);
  }

  public async findAll() {
    return this.domainsRepository.findAll();
  }

  public async findOne(id: string) {
    return this.findDomainWithValidation(id);
  }

  public async remove(id: string) {
    const domain = await this.findDomainWithValidation(id);
    this.logger.log(`Removing domain: ${domain.name} (ID: ${id})`);
    return this.domainsRepository.remove({ id });
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

    const updatedDomain = await this.domainsRepository.updateExpirationMetadata({ id, ...expirationMetadata });
    const isExpiringSoon =
      updatedDomain.expirationDate &&
      updatedDomain.expirationDate < new Date(Date.now() + this.EXPIRATION_THRESHOLD) &&
      updatedDomain.expirationDate > new Date();
    const wasNotRecentlyNotified =
      updatedDomain.lastNotifiedAt === null ||
      updatedDomain.lastNotifiedAt < new Date(Date.now() - this.NOTIFICATION_THRESHOLD);

    if (isExpiringSoon && wasNotRecentlyNotified) {
      this.logger.log(`Creating notification for domain: ${updatedDomain.name}`);
      await this.notificationsService.createNotification(updatedDomain.userId, {
        message: `Domain ${updatedDomain.name} is expiring on ${updatedDomain.expirationDate}`,
        topic: NotificationTopic.DOMAIN_EXPIRATION,
      });
    }

    this.refreshDomainCertificates(updatedDomain).catch((error) =>
      this.logger.error(`Error updating SSL certificates: ${JSON.stringify(error)}`),
    );

    return updatedDomain;
  }

  private async refreshDomainCertificates(domain: Domain) {
    await this.sslCertificateService.findAndInsertCertificatesForDomain(domain.id);
    await this.sslCertificateService.updateCertificateExpirationDatesForDomain(domain);
  }

  private async findDomainWithValidation(id: string) {
    if (!id) {
      throw new UnprocessableEntityException('Id is required');
    }

    const domain = await this.domainsRepository.findOne({ id });
    if (!domain) {
      throw new NotFoundException(`Domain with ID ${id} not found`);
    }

    return domain;
  }

  private async findDomainWithUserValidation(id: string, userId: string) {
    if (!id || !userId) {
      throw new UnprocessableEntityException('Id and userId are required');
    }

    const domain = await this.domainsRepository.findOneWithUserWithCertificates({ id, userId });
    if (!domain) {
      throw new NotFoundException(`Domain with ID ${id} not found for user ${userId}`);
    }

    return domain;
  }
}
