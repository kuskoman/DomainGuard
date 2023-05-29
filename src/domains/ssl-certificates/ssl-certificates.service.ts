import { Injectable } from '@nestjs/common';
import * as https from 'https';
import * as tls from 'tls';

@Injectable()
export class SslCertificatesService {
  public async checkSslExpiration(domain: string): Promise<Date | null> {
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
