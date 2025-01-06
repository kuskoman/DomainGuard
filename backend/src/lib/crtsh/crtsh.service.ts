import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { lastValueFrom } from 'rxjs';
import { CRTSHResultItem } from './crtsh.interfaces';
import { HttpService } from '@nestjs/axios';
import isValidHostname from 'is-valid-hostname';

@Injectable()
export class CrtshService {
  private readonly logger = new Logger(CrtshService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Queries crt.sh for certificate data.
   *
   * @param query - Query string, e.g., %.example.org
   * @param options - Optional Axios configuration and proxy settings
   * @returns Array of CRTSHResultItem
   */
  public async query(
    query: string,
    options?: { axiosConfig?: AxiosRequestConfig; proxy?: string },
  ): Promise<CRTSHResultItem[]> {
    try {
      const axiosConfig: AxiosRequestConfig = options?.axiosConfig ?? {};

      axiosConfig.params = {
        q: query,
        output: 'json',
      };

      const response = await lastValueFrom(this.httpService.get<CRTSHResultItem[]>('https://crt.sh/', axiosConfig));

      if (!response?.data) {
        this.logger.error('Empty response from CRT.SH');
        throw new Error('CRTSH: Empty response from CRT.SH');
      }

      if (!Array.isArray(response.data)) {
        this.logger.error('Response is not an array');
        throw new Error('CRTSH: Response is not an array');
      }

      return response.data;
    } catch (error) {
      this.logger.error('Error querying crt.sh:', error);
      throw new Error('CRTSH: Exception while querying crt.sh');
    }
  }

  /**
   * Retrieves a list of hostnames associated with a domain.
   *
   * @param hostname - Hostname query, e.g., %.example.org
   * @param options - Optional Axios configuration
   * @returns Array of unique hostnames
   */
  public async getHostnames(hostname: string, options?: { axiosConfig?: AxiosRequestConfig }): Promise<string[]> {
    const results = await this.query(hostname, options);

    this.logger.verbose(`CRTSH: Found ${results.length} results for ${hostname}`);

    const parsedResults = results
      .filter((item) => isValidHostname(item.common_name))
      .flatMap((item) => item.name_value.split('\n'))
      .filter((name) => isValidHostname(name))
      .reduce<string[]>((uniqueNames, name) => (uniqueNames.includes(name) ? uniqueNames : [...uniqueNames, name]), []);

    console.log(JSON.stringify(parsedResults));
    return parsedResults;
  }
}
