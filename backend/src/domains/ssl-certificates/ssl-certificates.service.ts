import { Injectable, Logger } from '@nestjs/common';
import { CrtshService } from '@src/lib/crtsh/crtsh.service';
import * as https from 'https';
import * as tls from 'tls';
import { SslCertificatesRepository } from './ssl-certificates.repository';
import { Domain } from '@prisma/client';

@Injectable()
export class SslCertificatesService {
  private readonly logger = new Logger(SslCertificatesService.name);

  constructor(
    private readonly crtshService: CrtshService,
    private readonly sslCertificatesRepository: SslCertificatesRepository,
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

  public async updateCertificateExpirationDatesForDomain(domain: Domain): Promise<void> {
    this.logger.log(`Updating SSL certificates expiration for domain: ${domain.name} (ID: ${domain.id})`);

    const certificates = await this.sslCertificatesRepository.findCertificatesByDomainId(domain.id);
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
