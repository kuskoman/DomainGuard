import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from '@src/lib/db/db.service';
import { DomainsRepository } from './domains.repository';
import {
  CreateDomainInput,
  FindDomainsByUserInput,
  FindDomainInput,
  RemoveDomainInput,
  UpdateExpirationDateInput,
} from './domains.interfaces';

describe(DomainsRepository.name, () => {
  let repository: DomainsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DomainsRepository,
        {
          provide: DbService,
          useValue: mockDbService,
        },
      ],
    }).compile();

    repository = module.get<DomainsRepository>(DomainsRepository);
  });

  describe('create', () => {
    it('should create a domain if it does not exist', async () => {
      const input: CreateDomainInput = { name: testDomain.name, userId: testDomain.userId };
      mockDbService.domain.findFirst.mockResolvedValueOnce(null);

      const result = await repository.create(input);
      expect(result).toEqual(testDomain);
    });

    it('should throw an error if the domain already exists', async () => {
      mockDbService.domain.findFirst.mockResolvedValueOnce(testDomain);
      const input: CreateDomainInput = { name: testDomain.name, userId: testDomain.userId };
      await expect(repository.create(input)).rejects.toThrowError();
    });
  });

  describe('findAllWithUser', () => {
    it('should find all domains for a user', async () => {
      const input: FindDomainsByUserInput = { userId: testDomain.userId };
      const result = await repository.findAllWithUser(input);
      expect(result).toEqual([testDomain]);
    });
  });

  describe('findOneWithUser', () => {
    it('should find one domain by id for a user', async () => {
      const input: FindDomainInput = { id: testDomain.id, userId: testDomain.userId };
      const result = await repository.findOneWithUser(input);
      expect(result).toEqual(testDomain);
    });
  });

  describe('removeWithUser', () => {
    it('should delete a domain by id for a user', async () => {
      const input: RemoveDomainInput = { id: testDomain.id };
      const result = await repository.removeWithUser(input);
      expect(result).toEqual(testDomain);
    });
  });

  describe('findAll', () => {
    it('should find all domains', async () => {
      const result = await repository.findAll();
      expect(result).toEqual([testDomain]);
    });
  });

  describe('findOne', () => {
    it('should find one domain by id', async () => {
      const input: FindDomainInput = { id: testDomain.id };
      const result = await repository.findOne(input);
      expect(result).toEqual(testDomain);
    });

    it('should return null if domain is not found', async () => {
      mockDbService.domain.findUnique.mockResolvedValueOnce(null);
      const input: FindDomainInput = { id: testDomain.id };
      const result = await repository.findOne(input);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a domain by id', async () => {
      const input: RemoveDomainInput = { id: testDomain.id };
      const result = await repository.remove(input);
      expect(result).toEqual(testDomain);
    });
  });

  describe('updateExpirationDate', () => {
    it('should update a domain expiration date', async () => {
      const input: UpdateExpirationDateInput = { id: testDomain.id, expirationDate: new Date(), renewalDate: null };

      const mockedDate = new Date();
      const mockedResult = { ...testDomain, lastCheckedAt: mockedDate, expirationDate: input.expirationDate };
      mockDbService.domain.update.mockResolvedValueOnce(mockedResult);
      const result = await repository.updateExpirationMetadata(input);
      expect(result.expirationDate).toEqual(input.expirationDate);
      expect(result.lastCheckedAt).toBeInstanceOf(Date);
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
