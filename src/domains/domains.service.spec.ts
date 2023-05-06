import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from '@src/db/db.service';
import { DomainsService } from './domains.service';

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
  },
};

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
      ],
    }).compile();

    service = module.get<DomainsService>(DomainsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create method', () => {
    it('should create a domain', async () => {
      const result = await service.create(testDomain.name, testDomain.userId);
      expect(result).toEqual(testDomain);
    });
  });

  describe('findAll method', () => {
    it('should find all domains for a user', async () => {
      const result = await service.findAll(testDomain.userId);
      expect(result).toEqual([testDomain]);
    });
  });

  describe('findOne method', () => {
    it('should find one domain by id for a user', async () => {
      const result = await service.findOne(testDomain.id, testDomain.userId);
      expect(result).toEqual(testDomain);
    });
  });

  describe('remove method', () => {
    it('should remove a domain by id for a user', async () => {
      const result = await service.remove(testDomain.id, testDomain.userId);
      expect(result).toEqual(testDomain);
    });
  });
});
