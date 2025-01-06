import { Test, TestingModule } from '@nestjs/testing';
import { DomainsExpirationService } from './domains-expiration.service';
import whois from 'whois-json';

jest.mock('whois-json');

describe(DomainsExpirationService.name, () => {
  let service: DomainsExpirationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DomainsExpirationService],
    }).compile();

    service = module.get<DomainsExpirationService>(DomainsExpirationService);
  });

  describe('getExpirationMetadata', () => {
    const domain = 'example.com';

    it('should return expiration metadata when whois returns a single record', async () => {
      const expirationDate = new Date('2024-01-01T00:00:00.000Z');
      const whoisData = {
        registrarRegistrationExpirationDate: expirationDate.toISOString(),
      };

      (whois as jest.Mock).mockResolvedValueOnce(whoisData);

      const result = await service.getExpirationMetadata(domain);
      expect(result).toEqual({ expirationDate, renewalDate: null });
      expect(whois).toHaveBeenCalledWith(domain);
    });

    it('should return expiration metadata when whois returns an array', async () => {
      const expirationDate = new Date('2024-01-01T00:00:00.000Z');
      const whoisArray = [
        { data: { registrarRegistrationExpirationDate: expirationDate.toISOString() } },
        { data: { registrarRegistrationExpirationDate: new Date('2023-01-01T00:00:00.000Z') } },
      ];

      (whois as jest.Mock).mockResolvedValueOnce(whoisArray);

      const result = await service.getExpirationMetadata(domain);
      expect(result).toEqual({ expirationDate, renewalDate: null });
      expect(whois).toHaveBeenCalledWith(domain);
    });

    it('should return expiration metadata from possible response structure', async () => {
      const expirationDate = new Date('2024-01-01T00:00:00.000Z');
      const renewalDate = new Date('2023-12-01T00:00:00.000Z');
      const possibleResponse = {
        optionExpirationDate: expirationDate.toISOString(),
        renewalDate: renewalDate.toISOString(),
      };

      (whois as jest.Mock).mockResolvedValueOnce(possibleResponse);

      const result = await service.getExpirationMetadata(domain);
      expect(result).toEqual({ expirationDate, renewalDate });
      expect(whois).toHaveBeenCalledWith(domain);
    });

    it('should return null when expiration date is missing', async () => {
      const whoisData = {
        registrarRegistrationExpirationDate: null,
      };

      (whois as jest.Mock).mockResolvedValueOnce(whoisData);

      const result = await service.getExpirationMetadata(domain);
      expect(result).toEqual({ expirationDate: null, renewalDate: null });
      expect(whois).toHaveBeenCalledWith(domain);
    });

    it('should throw an error when whois lookup fails', async () => {
      const errorMessage = 'Whois lookup failed';
      (whois as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(service.getExpirationMetadata(domain)).rejects.toThrowError(errorMessage);
      expect(whois).toHaveBeenCalledWith(domain);
    });

    it('should return null when whois returns null', async () => {
      (whois as jest.Mock).mockResolvedValueOnce(null);

      const result = await service.getExpirationMetadata(domain);
      expect(result).toBeNull();
      expect(whois).toHaveBeenCalledWith(domain);
    });
  });

  describe('helper methods', () => {
    it('should extract expiration metadata from possible response', () => {
      const expirationDate = new Date('2024-01-01T00:00:00.000Z');
      const renewalDate = new Date('2023-12-01T00:00:00.000Z');
      const possibleResponse = {
        optionExpirationDate: expirationDate.toISOString(),
        renewalDate: renewalDate.toISOString(),
      };

      const result = (service as any).extractWhoisDataFromPossibleResponse(possibleResponse);
      expect(result).toEqual({ expirationDate, renewalDate });
    });

    it('should extract expiration metadata from whois result', () => {
      const expirationDate = new Date('2024-01-01T00:00:00.000Z');
      const whoisResult = {
        registrarRegistrationExpirationDate: expirationDate.toISOString(),
      };

      const result = (service as any).extractWhoisDataFromWhoisResult(whoisResult);
      expect(result).toEqual({ expirationDate, renewalDate: null });
    });

    it('should handle array-based whois results', () => {
      const whoisArray = [{ data: { registrarRegistrationExpirationDate: '2024-01-01T00:00:00.000Z' } }];

      const result = (service as any).extractWhoisData(whoisArray);
      expect(result).toEqual(whoisArray[0].data);
    });

    it('should handle non-array whois results', () => {
      const whoisData = { registrarRegistrationExpirationDate: '2024-01-01T00:00:00.000Z' };

      const result = (service as any).extractWhoisData(whoisData);
      expect(result).toEqual(whoisData);
    });

    it('should detect possible response structure', () => {
      const possibleResponse = { optionExpirationDate: '2024-01-01T00:00:00.000Z' };

      const result = (service as any).isNotDefinedWhoisReturnType(possibleResponse);
      expect(result).toBe(true);
    });

    it('should detect non-possible response structure', () => {
      const whoisResult = { registrarRegistrationExpirationDate: '2024-01-01T00:00:00.000Z' };

      const result = (service as any).isNotDefinedWhoisReturnType(whoisResult);
      expect(result).toBe(false);
    });
  });
});
