import { Test, TestingModule } from '@nestjs/testing';
import { DomainsController } from './domains.controller';
import { DomainsService } from './domains.service';
import { LoggedGuard } from '@src/auth/guards/logged.guard';
import { NotFoundException } from '@nestjs/common';
import { SslCertificateDto } from './ssl-certificates/dto/ssl-certificate.dto';

describe(DomainsController.name, () => {
  let controller: DomainsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DomainsController],
      providers: [
        {
          provide: DomainsService,
          useValue: domainsServiceMock,
        },
      ],
    })
      .overrideGuard(LoggedGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DomainsController>(DomainsController);
  });

  describe('create method', () => {
    it('should create a domain', async () => {
      const result = await controller.create({ name: testDomain.name }, { userId: testDomain.userId } as any);
      expect(result).toEqual(testDomain);
    });
  });

  describe('findAll method', () => {
    it('should find all domains for a user', async () => {
      const result = await controller.findAll({ userId: testDomain.userId } as any);
      expect(result).toEqual([testDomain]);
    });
  });

  describe('findOne method', () => {
    it('should find one domain by id for a user', async () => {
      domainsServiceMock.findOneWithUser.mockResolvedValueOnce(testDomainWithCertificates);

      const result = await controller.findOne(testDomain.userId, { id: testDomain.id });

      expect(domainsServiceMock.findOneWithUser).toHaveBeenCalledWith(testDomain.id, testDomain.userId);
      expect(result).toEqual({
        ...testDomainWithCertificates,
        sslCertificates: testDomainWithCertificates.sslCertificates.map((cert) => new SslCertificateDto(cert)),
      });
    });

    it('should throw NotFoundException when domain is not found', async () => {
      domainsServiceMock.findOneWithUser.mockResolvedValueOnce(null);
      await expect(controller.findOne(testDomain.userId, { id: 'wrong-id' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('refreshDomainExpiration method', () => {
    it('should update the expiration date of a domain for a user', async () => {
      const result = await controller.refreshDomainExpirations({ userId: testDomain.userId } as any, {
        id: testDomain.id,
      });
      expect(result).toEqual(testExpirationDateDomain);
    });

    it('should throw NotFoundException when domain is not found', async () => {
      domainsServiceMock.updateDomainExpirationDateWithUser.mockImplementationOnce(async () => {
        throw new NotFoundException();
      });

      await expect(controller.refreshDomainExpirations(testDomain.userId, { id: 'wrong-id' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

const testDomain = {
  id: '1',
  name: 'example.com',
  userId: 'test-user-id',
};

const testDomainWithCertificates = {
  ...testDomain,
  sslCertificates: [
    {
      id: 'cert-1',
      domainId: '1',
      expirationDate: new Date(),
      lastCheckedAt: new Date(),
      hostname: 'example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

const testExpirationDateDomain = {
  ...testDomain,
  expirationDate: new Date(),
};

const domainsServiceMock = {
  create: jest.fn().mockResolvedValue(testDomain),
  findAllWithUser: jest.fn().mockResolvedValue([testDomain]),
  findOneWithUser: jest.fn().mockResolvedValue(testDomainWithCertificates),
  updateDomainExpirationDateWithUser: jest.fn().mockResolvedValue(testExpirationDateDomain),
};
