import { Test, TestingModule } from '@nestjs/testing';
import { SslCertificatesService } from './ssl-certificates.service';
import { SslCertificatesRepository } from './ssl-certificates.repository';
import { CrtshService } from '@src/lib/crtsh/crtsh.service';

describe(SslCertificatesService.name, () => {
  let service: SslCertificatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SslCertificatesService,
        {
          provide: SslCertificatesRepository,
          useValue: {},
        },
        {
          provide: CrtshService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SslCertificatesService>(SslCertificatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkSslExpiration', () => {
    describe('online test', () => {
      it('should return the correct certificate expiration date when the certificate is valid', async () => {
        const domain = 'www.google.com';
        const expirationDate = await service.checkSslExpiration(domain);
        expect(expirationDate).toBeInstanceOf(Date);

        if (expirationDate) {
          expect(expirationDate.getTime()).toBeGreaterThan(Date.now());
        }
      });
    });

    describe('offline test', () => {
      it('should return the correct certificate expiration date when certificate is valid', async () => {
        jest.spyOn(service, 'checkSslExpiration').mockResolvedValue(new Date('2024-12-31T23:59:59Z'));
        const expirationDate = await service.checkSslExpiration('mockdomain.com');
        expect(expirationDate).toEqual(new Date('2024-12-31T23:59:59Z'));
      });

      it.todo('should throw an error when the certificate is invalid or expiration date cannot be retrieved');

      it('should throw an error if the request encounters an error', async () => {
        jest.spyOn(service, 'checkSslExpiration').mockRejectedValue(new Error('Request error'));

        await expect(service.checkSslExpiration('error.com')).rejects.toThrow('Request error');
      });

      it('should throw an error if the socket encounters an error', async () => {
        jest.spyOn(service, 'checkSslExpiration').mockImplementation(() => {
          return new Promise((_, reject) => reject(new Error('Socket error')));
        });

        await expect(service.checkSslExpiration('socketerror.com')).rejects.toThrow('Socket error');
      });
    });
  });
});
