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

  describe('getExpirationDate', () => {
    const domain = 'example.com';

    it('should return the registrarRegistrationExpirationDate when whois returns a single record', async () => {
      const expirationDate = new Date('2024-01-01T00:00:00.000Z');
      const whoisData = {
        registrarRegistrationExpirationDate: expirationDate,
      };

      (whois as jest.Mock).mockResolvedValueOnce(whoisData);

      const result = await service.getExpirationDate(domain);
      expect(result).toEqual(expirationDate);
      expect(whois).toHaveBeenCalledWith(domain);
    });

    it('should return the registrarRegistrationExpirationDate when whois returns an array', async () => {
      const expirationDate = new Date('2024-01-01T00:00:00.000Z');
      const whoisArray = [
        { data: { registrarRegistrationExpirationDate: expirationDate } },
        { data: { registrarRegistrationExpirationDate: new Date('2023-01-01T00:00:00.000Z') } },
      ];

      (whois as jest.Mock).mockResolvedValueOnce(whoisArray);

      const result = await service.getExpirationDate(domain);
      expect(result).toEqual(expirationDate);
      expect(whois).toHaveBeenCalledWith(domain);
    });

    it('should throw an error when whois returns an error', async () => {
      const errorMessage = 'Whois lookup failed';
      (whois as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(service.getExpirationDate(domain)).rejects.toThrowError(errorMessage);
      expect(whois).toHaveBeenCalledWith(domain);
    });

    it('should return null when whois returns null', async () => {
      (whois as jest.Mock).mockResolvedValueOnce(null);

      const result = await service.getExpirationDate(domain);
      expect(result).toBeNull();
      expect(whois).toHaveBeenCalledWith(domain);
    });
  });
});
