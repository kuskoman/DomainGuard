import { Injectable } from '@nestjs/common';
import whois from 'whois-json';

@Injectable()
export class DomainsExpirationService {
  public async getExpirationDate(domain: string) {
    const whoisResult = await whois(domain);
    const whoisData = this.extractWhoisData(whoisResult);
    if (!whoisData) {
      return null;
    }
    return whoisData.registrarRegistrationExpirationDate;
  }

  /**
   * Extracts the whois data from the whois result. If the whois result is an array, it will return the first element.
   * In some cases, the whois result is an array of objects, so as a temporary solution, we will return the first element.
   */
  private extractWhoisData(whoisResult: Awaited<ReturnType<typeof whois>>) {
    if (Array.isArray(whoisResult)) {
      return whoisResult[0].data;
    }

    return whoisResult;
  }
}
