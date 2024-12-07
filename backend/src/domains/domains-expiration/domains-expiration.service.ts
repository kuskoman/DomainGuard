import { Injectable, Logger } from '@nestjs/common';
import whois from 'whois-json';

@Injectable()
export class DomainsExpirationService {
  private readonly logger = new Logger(DomainsExpirationService.name);

  public async getExpirationDate(domain: string): Promise<Date | null> {
    this.logger.log(`Getting expiration date for domain ${domain}`);
    const whoisResult = await whois(domain);
    const whoisData = this.extractWhoisData(whoisResult);
    if (!whoisData) {
      this.logger.warn(`Could not get whois data for domain ${domain}`);
      return null;
    }

    const whoisExpirationDate = whoisData.registrarRegistrationExpirationDate;
    if (!whoisExpirationDate) {
      this.logger.warn(`Could not get expiration date for domain ${domain}`);
      return null;
    }

    const parsedExpirationDate = new Date(whoisExpirationDate);
    return parsedExpirationDate;
  }

  /**
   * Extracts the whois data from the whois result. If the whois result is an array, it will return the first element.
   * In some cases, the whois result is an array of objects, so as a temporary solution, we will return the first element.
   */
  private extractWhoisData(whoisResult: Awaited<ReturnType<typeof whois>>) {
    if (Array.isArray(whoisResult)) {
      this.logger.log('Whois result is an array, extracting first element');
      return whoisResult[0].data;
    }

    return whoisResult;
  }
}
