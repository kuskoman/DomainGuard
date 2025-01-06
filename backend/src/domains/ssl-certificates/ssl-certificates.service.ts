import { Injectable, Logger } from '@nestjs/common';
import { CrtshService } from '@src/lib/crtsh/crtsh.service';
import * as https from 'https';
import * as tls from 'tls';

@Injectable()
export class SslCertificatesService {
  private readonly logger = new Logger(SslCertificatesService.name);

  constructor(private readonly crtshService: CrtshService) {}

  public async updateCertificatesForDomain(domain: string) {
    this.logger.log(`Updating SSL certificates for domain: ${domain}`);

    const hostnames = await this.fillAllSslCertificatesForDomain(domain);

    this.logger.log(`Found ${hostnames.length} certificates for domain: ${domain}`);
    return hostnames;
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

  private async fillAllSslCertificatesForDomain(rootDomain: string) {
    const hostnames = await this.crtshService.getHostnames(rootDomain);
    return hostnames;
  }
}
