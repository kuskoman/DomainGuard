import { Injectable, Logger } from '@nestjs/common';
import { Domain } from '@prisma/client';
import { DbService } from '@src/lib/db/db.service';

const SEVEN_DAYS = 60 * 60 * 24 * 7;

@Injectable()
export class SslCertificatesRepository {
  private readonly logger = new Logger(SslCertificatesRepository.name);

  constructor(private readonly dbService: DbService) {}

  public async findAllDomains() {
    return await this.dbService.domain.findMany();
  }

  /** Finds certificates that are expiring within the given treshold.
   *  @param treshold The number of seconds before expiration to consider a certificate as expiring.
   */
  public async findExpiringCertificates(threshold = SEVEN_DAYS, lastNotifiedAt: Date | null = null) {
    const now = new Date();
    const thresholdUnixTimestamp = threshold * 1000;
    const expirationDate = new Date(now.getTime() + thresholdUnixTimestamp);

    const lastNotifiedAtDate = lastNotifiedAt ? { lte: lastNotifiedAt } : null;

    const certificates = await this.dbService.sslCertificate.findMany({
      where: {
        expirationDate: {
          lte: expirationDate,
        },
        lastNotifiedAt: lastNotifiedAtDate,
      },
      include: {
        domain: {
          select: {
            userId: true,
          },
        },
      },
    });

    this.logger.debug(`Found ${certificates.length} expiring certificates`);
    return certificates;
  }

  public async findOne(certificateId: string) {
    return await this.dbService.sslCertificate.findUniqueOrThrow({
      where: { id: certificateId },
    });
  }

  public async updateLastNotifiedAt(certificateId: string, lastNotifiedAt: Date = new Date()) {
    this.logger.debug(`Updating last notified at for certificate: ${certificateId}`);

    return await this.dbService.sslCertificate.update({
      where: { id: certificateId },
      data: {
        lastNotifiedAt,
      },
    });
  }

  public async getExistingHostnames(allHostnames: string[]) {
    const result = await this.dbService.sslCertificate.findMany({
      where: {
        hostname: {
          in: allHostnames,
        },
      },
      select: {
        hostname: true,
      },
    });

    this.logger.debug(`Found ${result.length} existing hostnames`);
    return result;
  }

  public async findNewHostnames(allHostnames: string[]) {
    const existingCertificates = await this.dbService.sslCertificate.findMany({
      where: {
        hostname: {
          notIn: allHostnames,
        },
      },
      select: {
        hostname: true,
      },
    });

    this.logger.debug(`Found ${existingCertificates.length} existing certificates`);
    const existingHostnames = existingCertificates.map((certificate) => certificate.hostname);
    const newHostnames = allHostnames.filter((hostname) => !existingHostnames.includes(hostname));

    this.logger.debug(`Determined ${newHostnames.length} to be new`);
    return newHostnames;
  }

  public async findDomainById(domainId: string) {
    return await this.dbService.domain.findUniqueOrThrow({
      where: { id: domainId },
    });
  }

  public async findCertificatesByDomainId(domainId: string) {
    return await this.dbService.sslCertificate.findMany({
      where: {
        domain: {
          id: domainId,
        },
      },
    });
  }

  public async updateCertificateExpirationDate(certificateId: string, expirationDate: Date | null) {
    this.logger.debug(`Updating expiration date for certificate: ${certificateId}`);

    const now = new Date();

    return await this.dbService.sslCertificate.update({
      where: { id: certificateId },
      data: {
        expirationDate,
        lastCheckedAt: now,
      },
    });
  }

  public async createMultipleHostnames(domain: Domain, hostnames: string[]) {
    this.logger.debug(`Creating ${hostnames.length} hostnames for domain: ${domain.name}`);

    const result = await this.dbService.sslCertificate.createMany({
      data: hostnames.map((hostname) => ({
        domainId: domain.id,
        hostname,
      })),
    });

    this.logger.debug(`Created ${hostnames.length} hostnames for domain: ${domain.name}`);
    return result;
  }
}
