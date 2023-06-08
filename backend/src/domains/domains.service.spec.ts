import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from '@src/db/db.service';
import { DomainsService } from './domains.service';
import { DomainsExpirationService } from './domains-expiration/domains-expiration.service';

describe(DomainsService.name, () => {
  let service: DomainsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DomainsService,
        {
          provide: DbService,
          useValue: mockDbService,
        },
        {
          provide: DomainsExpirationService,
          useValue: mockExpirationService,
        },
      ],
    }).compile();

    service = module.get<DomainsService>(DomainsService);
  });

  describe('create method', () => {
    it('should create a domain', async () => {
      const result = await service.create(testDomain.name, testDomain.userId);
      expect(result).toEqual(testDomain);
    });
  });

  describe('findAllWithUser method', () => {
    it('should find all domains for a user', async () => {
      const result = await service.findAllWithUser(testDomain.userId);
      expect(result).toEqual([testDomain]);
    });
  });

  describe('findOneWithUser method', () => {
    it('should find one domain by id for a user', async () => {
      const result = await service.findOneWithUser(testDomain.id, testDomain.userId);
      expect(result).toEqual(testDomain);
    });
  });

  describe('removeWithUser method', () => {
    it('should remove a domain by id for a user', async () => {
      const result = await service.removeWithUser(testDomain.id, testDomain.userId);
      expect(result).toEqual(testDomain);
    });
  });

  describe('updateExpirationDateWithUser method', () => {
    beforeEach(() => {
      mockDbService.domain.update = jest.fn().mockResolvedValue(testExpirationDateDomain);
    });

    it('should update the expiration date of a domain for a user', async () => {
      const result = await service.updateDomainExpirationDateWithUser(testDomain.id, testDomain.userId);
      expect(result).toEqual(testExpirationDateDomain);
      expect(mockDbService.domain.findUnique).toHaveBeenCalledWith({ where: { id: testDomain.id } });
      expect(mockExpirationService.getExpirationDate).toHaveBeenCalledWith(testDomain.name);
      expect(mockDbService.domain.update).toHaveBeenCalledWith({
        where: { id: testDomain.id },
        data: { expirationDate: testExpirationDateDomain.expirationDate },
      });
    });
  });

  describe('findAll method', () => {
    it('should find all domains', async () => {
      const result = await service.findAll();
      expect(result).toEqual([testDomain]);
    });
  });

  describe('findOne method', () => {
    it('should find one domain by id', async () => {
      const result = await service.findOne(testDomain.id);
      expect(result).toEqual(testDomain);
    });
  });

  describe('remove method', () => {
    it('should remove a domain by id', async () => {
      const result = await service.remove(testDomain.id);
      expect(result).toEqual(testDomain);
    });
  });

  describe('updateExpirationDate method', () => {
    beforeEach(() => {
      mockDbService.domain.update = jest.fn().mockResolvedValue(testExpirationDateDomain);
    });

    it('should update the expiration date of a domain', async () => {
      const result = await service.updateDomainExpirationDate(testDomain.id);
      expect(result).toEqual(testExpirationDateDomain);
      expect(mockDbService.domain.findUnique).toHaveBeenCalledWith({ where: { id: testDomain.id } });
      expect(mockExpirationService.getExpirationDate).toHaveBeenCalledWith(testDomain.name);
      expect(mockDbService.domain.update).toHaveBeenCalledWith({
        where: { id: testDomain.id },
        data: { expirationDate: testExpirationDateDomain.expirationDate },
      });
    });
  });
});

const testDomain = {
  id: '1',
  name: 'example.com',
  userId: 'test-user-id',
};

const mockDbService = {
  domain: {
    create: jest.fn().mockResolvedValue(testDomain),
    findMany: jest.fn().mockResolvedValue([testDomain]),
    findFirst: jest.fn().mockResolvedValue(testDomain),
    findUnique: jest.fn().mockResolvedValue(testDomain),
    delete: jest.fn().mockResolvedValue(testDomain),
    update: jest.fn().mockResolvedValue(testDomain),
  },
};

const mockExpirationService = {
  getExpirationDate: jest.fn().mockResolvedValue(new Date()),
};

const testExpirationDateDomain = {
  ...testDomain,
  expirationDate: new Date(),
};
