import { Injectable, Logger } from '@nestjs/common';
import whois from 'whois-json';
import { ExpirationMetadata, WhoisDataPossibleResponse, WhoisResult } from './domain-expiration.interfaces';

@Injectable()
export class DomainsExpirationService {
  private readonly logger = new Logger(DomainsExpirationService.name);

  public async getExpirationMetadata(domain: string): Promise<ExpirationMetadata | null> {
    this.logger.log(`Getting expiration date for domain ${domain}`);
    const whoisResult = await whois(domain);
    const whoisData = this.extractWhoisData(whoisResult);
    if (!whoisData) {
      this.logger.warn(`Could not get whois data for domain ${domain}`);
      return null;
    }

    let expirationMetadata: ExpirationMetadata;
    if (this.isNotDefinedWhoisReturnType(whoisData)) {
      expirationMetadata = this.extractWhoisDataFromPossibleResponse(whoisData);
    } else {
      expirationMetadata = this.extractWhoisDataFromWhoisResult(whoisData);
    }

    if (!expirationMetadata.expirationDate) {
      this.logger.warn(`Could not get expiration date for domain ${domain}`);
      this.logger.debug(`Whois data: ${JSON.stringify(whoisData)}`);
      return expirationMetadata;
    }

    this.logger.log(`Got expiration date for domain ${domain}: ${expirationMetadata.expirationDate.toISOString()}`);
    return expirationMetadata;
  }

  private extractWhoisDataFromPossibleResponse(whoisData: WhoisDataPossibleResponse): ExpirationMetadata {
    return {
      expirationDate: new Date(whoisData.optionExpirationDate),
      renewalDate: whoisData.renewalDate ? new Date(whoisData.renewalDate) : null,
    };
  }

  private extractWhoisDataFromWhoisResult(whoisData: ReturnType<typeof this.extractWhoisData>): ExpirationMetadata {
    const expirationDateString = whoisData.registrarRegistrationExpirationDate;
    const expirationDate = expirationDateString ? new Date(expirationDateString) : null;
    return {
      expirationDate: expirationDate,
      renewalDate: null,
    };
  }
  /**
   * Extracts the whois data from the whois result. If the whois result is an array, it will return the first element.
   * In some cases, the whois result is an array of objects, so as a temporary solution, we will return the first element.
   */
  private extractWhoisData(whoisResult: WhoisResult) {
    if (Array.isArray(whoisResult)) {
      this.logger.log('Whois result is an array, extracting first element');
      return whoisResult[0].data;
    }

    return whoisResult;
  }

  private isNotDefinedWhoisReturnType(
    whoisResult: WhoisResult | WhoisDataPossibleResponse,
  ): whoisResult is WhoisDataPossibleResponse {
    return (whoisResult as WhoisDataPossibleResponse).optionExpirationDate !== undefined;
  }
}
