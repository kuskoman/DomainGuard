import { Injectable, Logger } from '@nestjs/common';
import { CrtshService } from '@src/lib/crtsh/crtsh.service';
import * as https from 'https';
import * as tls from 'tls';
import { SslCertificatesRepository } from './ssl-certificates.repository';
import { Domain, NotificationTopic } from '@prisma/client';
import { NotificationsService } from '@src/notifications/notifications.service';

const SEVEN_DAYS = 60 * 60 * 24 * 7 * 1000;

@Injectable()
export class SslCertificatesService {
  private readonly logger = new Logger(SslCertificatesService.name);
  private readonly NOTIFICATION_THRESHOLD = SEVEN_DAYS;
  private readonly EXPIRATION_THRESHOLD = SEVEN_DAYS;

  constructor(
    private readonly crtshService: CrtshService,
    private readonly sslCertificatesRepository: SslCertificatesRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  public async findAndInsertCertificatesForDomain(domainId: string): Promise<string[]> {
    const domain = await this.sslCertificatesRepository.findDomainById(domainId);
    this.logger.log(`Updating SSL certificates for domain: ${domain.name} (ID: ${domain.id})`);

    const hostnames = await this.crtshService.getHostnames(domain.name);
    const newHostnames = await this.sslCertificatesRepository.findNewHostnames(hostnames);

    if (newHostnames.length === 0) {
      this.logger.log(`No new hostnames found for domain: ${domain.name}`);
      return [];
    }

    this.logger.log(`Found ${hostnames.length} certificates for domain: ${domain.name}`);
    await this.sslCertificatesRepository.createMultipleHostnames(domain, newHostnames);
    return hostnames;
  }

  public async findOne(id: string) {
    return this.sslCertificatesRepository.findOne(id);
  }

  public async updateCertificateExpirationDatesForDomain(domain: Domain): Promise<void> {
    this.logger.log(`Updating SSL certificates expiration for domain: ${domain.name} (ID: ${domain.id})`);

    const certificates = await this.sslCertificatesRepository.findCertificatesByDomainId(domain.id);
    const notificationThresholdDate = new Date(new Date().getTime() - this.NOTIFICATION_THRESHOLD);
    const expirationThresholdDate = new Date(new Date().getTime() + this.EXPIRATION_THRESHOLD);

    const certificateUpdatePromises = certificates.map(async (certificate) => {
      const expirationDate = await this.checkSslExpiration(certificate.hostname);
      if (certificate.expirationDate !== null && expirationDate === null) {
        this.logger.error(`Could not retrieve expiration date for certificate: ${certificate.hostname}`);
        return;
      }

      // currently this causes DB to handle multiple updates, but it could be optimized to a single query
      // if we want to update all certificates at once. This would require custom SQL query
      // which I don't want to do at this moment, as this part is not performance critical
      await this.sslCertificatesRepository.updateCertificateExpirationDate(certificate.id, expirationDate);
      this.logger.log(`Updated expiration date for certificate: ${certificate.hostname}`);

      const wasNotRecentlyNotified =
        certificate.lastNotifiedAt === null || certificate.lastNotifiedAt < notificationThresholdDate;

      if (!wasNotRecentlyNotified) {
        this.logger.log(`Certificate ${certificate.hostname} was recently notified (at ${certificate.lastNotifiedAt})`);
      }

      const isExpiringSoon = expirationDate && expirationDate < expirationThresholdDate && expirationDate > new Date();

      if (!isExpiringSoon) {
        this.logger.log(`Certificate ${certificate.hostname} is not expiring soon (expires on ${expirationDate})`);
      }

      if (wasNotRecentlyNotified && isExpiringSoon) {
        const { userId } = domain;
        const expiresOn = expirationDate?.toISOString();
        const expiresIn = expirationDate
          ? Math.floor((expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : null;

        this.logger.log(`Creating notification for certificate: ${certificate.hostname}`);
        await this.notificationsService.createNotification(userId, {
          message: `Certificate for ${certificate.hostname} is expiring on ${expiresOn} (${expiresIn} days)`,
          topic: NotificationTopic.SSL_EXPIRATION,
        });
        await this.sslCertificatesRepository.updateLastNotifiedAt(certificate.id);
      }
    });

    await Promise.all(certificateUpdatePromises);

    this.logger.log(
      `Finished updating SSL certificates expiration for domain: ${domain.name} (ID: ${domain.id}), ${certificates.length} certificates updated`,
    );
  }

  public async checkSslExpiration(domain: string): Promise<Date | null> {
    this.logger.log(`Checking SSL expiration for domain: ${domain}`);

    return new Promise((resolve, reject) => {
      const req = https.request({
        host: domain,
        port: 443,
        method: 'HEAD',
        agent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });

      req.on('socket', (socket: tls.TLSSocket) => {
        socket.on('secureConnect', () => {
          const cert = socket.getPeerCertificate();
          if (!cert.valid_to) {
            reject(new Error('Could not retrieve certificate expiration'));
          } else {
            // Note: valid_to is in format 'Feb 28 12:00:00 2023 GMT', we need to parse it
            resolve(new Date(cert.valid_to));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  }
}
