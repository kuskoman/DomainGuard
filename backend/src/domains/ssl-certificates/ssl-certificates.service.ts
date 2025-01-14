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

    await Promise.all(
      certificates.map((certificate) => this.refreshCertificate(certificate.id, certificate.hostname, domain)),
    );

    this.logger.log(
      `Finished updating SSL certificates expiration for domain: ${domain.name} (ID: ${domain.id}), ${certificates.length} certificates updated`,
    );
  }

  public async refreshCertificateById(certificateId: string): Promise<void> {
    this.logger.log(`Refreshing certificate with ID: ${certificateId}`);

    const certificate = await this.sslCertificatesRepository.findOne(certificateId);
    if (!certificate) {
      this.logger.warn(`Certificate with ID ${certificateId} not found`);
      return;
    }

    const domain = await this.sslCertificatesRepository.findDomainById(certificate.domainId);
    await this.refreshCertificate(certificate.id, certificate.hostname, domain);

    this.logger.log(`Finished refreshing certificate with ID: ${certificateId}`);
  }

  private async refreshCertificate(certificateId: string, hostname: string, domain: Domain): Promise<void> {
    this.logger.log(`Refreshing certificate for hostname: ${hostname}`);

    const expirationDate = await this.checkSslExpiration(hostname);
    if (!expirationDate) {
      this.logger.warn(`Could not retrieve expiration date for certificate: ${hostname}`);
      return;
    }

    await this.sslCertificatesRepository.updateCertificateExpirationDate(certificateId, expirationDate);
    this.logger.log(`Updated expiration date for certificate: ${hostname}`);

    const wasNotRecentlyNotified = await this.shouldNotifyCertificate(certificateId);
    const isExpiringSoon = this.isCertificateExpiringSoon(expirationDate);

    if (wasNotRecentlyNotified && isExpiringSoon) {
      await this.createNotificationForCertificate(domain.userId, hostname, expirationDate);
      await this.sslCertificatesRepository.updateLastNotifiedAt(certificateId);
    }
  }

  private async shouldNotifyCertificate(certificateId: string): Promise<boolean> {
    const certificate = await this.sslCertificatesRepository.findOne(certificateId);
    const notificationThresholdDate = new Date(new Date().getTime() - this.NOTIFICATION_THRESHOLD);

    return certificate.lastNotifiedAt === null || certificate.lastNotifiedAt < notificationThresholdDate;
  }

  private isCertificateExpiringSoon(expirationDate: Date): boolean {
    const expirationThresholdDate = new Date(new Date().getTime() + this.EXPIRATION_THRESHOLD);
    return expirationDate && expirationDate < expirationThresholdDate && expirationDate > new Date();
  }

  private async createNotificationForCertificate(
    userId: string,
    hostname: string,
    expirationDate: Date,
  ): Promise<void> {
    const expiresOn = expirationDate.toISOString();
    const expiresIn = Math.floor((expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    await this.notificationsService.createNotification(userId, {
      message: `Certificate for ${hostname} is expiring on ${expiresOn} (${expiresIn} days)`,
      topic: NotificationTopic.SSL_EXPIRATION,
    });
    this.logger.log(`Notification created for certificate: ${hostname}`);
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
