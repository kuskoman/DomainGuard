import { Test, TestingModule } from '@nestjs/testing';
import { DomainsController } from './domains.controller';
import { DomainsService } from './domains.service';
import { LoggedGuard } from '@src/auth/guards/logged.guard';
import { NotFoundException } from '@nestjs/common';

describe(DomainsController.name, () => {
  let controller: DomainsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DomainsController],
      providers: [
        {
          provide: DomainsService,
          useValue: mockDomainsService,
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
      const result = await controller.findOne({ userId: testDomain.userId } as any, { id: testDomain.id });
      expect(result).toEqual(testDomain);
    });

    it('should throw NotFoundException when domain is not found', async () => {
      mockDomainsService.findOneWithUser.mockResolvedValueOnce(null);
      await expect(controller.findOne({ userId: testDomain.userId } as any, { id: 'wrong-id' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('refreshDomainExpiration method', () => {
    it('should update the expiration date of a domain for a user', async () => {
      const result = await controller.refreshDomainExpiration({ userId: testDomain.userId } as any, {
        id: testDomain.id,
      });
      expect(result).toEqual(testExpirationDateDomain);
    });

    it('should throw NotFoundException when domain is not found', async () => {
      mockDomainsService.findOneWithUser.mockResolvedValueOnce(null);
      await expect(
        controller.refreshDomainExpiration({ userId: testDomain.userId } as any, { id: 'wrong-id' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

const testDomain = {
  id: '1',
  name: 'example.com',
  userId: 'test-user-id',
};

const testExpirationDateDomain = {
  ...testDomain,
  expirationDate: new Date(),
};

const mockDomainsService = {
  create: jest.fn().mockResolvedValue(testDomain),
  findAllWithUser: jest.fn().mockResolvedValue([testDomain]),
  findOneWithUser: jest.fn().mockResolvedValue(testDomain),
  updateDomainExpirationDateWithUser: jest.fn().mockResolvedValue(testExpirationDateDomain),
};
