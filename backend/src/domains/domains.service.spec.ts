import { Test, TestingModule } from '@nestjs/testing';
import { DomainsRepository } from './domains.repository';
import { DbService } from '@src/db/db.service';
import {
  CreateDomainInput,
  FindDomainsByUserInput,
  FindDomainInput,
  RemoveDomainInput,
  UpdateExpirationDateInput,
} from './domains.interfaces';
import { UnprocessableEntityException } from '@nestjs/common';

describe(DomainsRepository.name, () => {
  let repository: DomainsRepository;

  const testDomain = {
    id: '1',
    name: 'example.com',
    userId: 'test-user-id',
  };

  const testExpirationDate = new Date();

  const testUpdatedDomain = {
    ...testDomain,
    expirationDate: testExpirationDate,
  };

  const mockDbService = {
    domain: {
      create: jest.fn().mockResolvedValue(testDomain),
      findMany: jest.fn().mockResolvedValue([testDomain]),
      findFirst: jest.fn().mockResolvedValue(testDomain),
      findUnique: jest.fn().mockResolvedValue(testDomain),
      delete: jest.fn().mockResolvedValue(testDomain),
      update: jest.fn().mockResolvedValue(testUpdatedDomain),
    },
  };

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a domain', async () => {
      const input: CreateDomainInput = { name: testDomain.name, userId: testDomain.userId };

      mockDbService.domain.findFirst.mockResolvedValueOnce(null);

      const result = await repository.create(input);
      expect(result).toEqual(testDomain);
      expect(mockDbService.domain.create).toHaveBeenCalledWith({
        data: {
          name: input.name,
          user: { connect: { id: input.userId } },
        },
      });
    });

    it('should throw an error when a domain with the same name already exists', async () => {
      const input: CreateDomainInput = { name: testDomain.name, userId: testDomain.userId };

      mockDbService.domain.findFirst.mockResolvedValueOnce(testDomain);

      await expect(repository.create(input)).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('findAllWithUser', () => {
    it('should find all domains for a user', async () => {
      const input: FindDomainsByUserInput = { userId: testDomain.userId };
      const result = await repository.findAllWithUser(input);
      expect(result).toEqual([testDomain]);
      expect(mockDbService.domain.findMany).toHaveBeenCalledWith({
        where: { user: { id: input.userId } },
      });
    });
  });

  describe('findOneWithUser', () => {
    it('should find one domain by id for a user', async () => {
      const input: FindDomainInput = { id: testDomain.id, userId: testDomain.userId };
      const result = await repository.findOneWithUser(input);
      expect(result).toEqual(testDomain);
      expect(mockDbService.domain.findFirst).toHaveBeenCalledWith({
        where: { id: input.id, user: { id: input.userId } },
      });
    });

    it('should find one domain by id when userId is not provided', async () => {
      const input: FindDomainInput = { id: testDomain.id };
      const result = await repository.findOneWithUser(input);
      expect(result).toEqual(testDomain);
      expect(mockDbService.domain.findFirst).toHaveBeenCalledWith({
        where: { id: input.id },
      });
    });
  });

  describe('removeWithUser', () => {
    it('should remove a domain by id for a user', async () => {
      const input: RemoveDomainInput = { id: testDomain.id, userId: testDomain.userId };
      const result = await repository.removeWithUser(input);
      expect(result).toEqual(testDomain);
      expect(mockDbService.domain.delete).toHaveBeenCalledWith({
        where: { id: input.id, user: { id: input.userId } },
      });
    });

    it('should remove a domain by id when userId is not provided', async () => {
      const input: RemoveDomainInput = { id: testDomain.id };
      const result = await repository.removeWithUser(input);
      expect(result).toEqual(testDomain);
      expect(mockDbService.domain.delete).toHaveBeenCalledWith({
        where: { id: input.id },
      });
    });
  });

  describe('findAll', () => {
    it('should find all domains', async () => {
      const result = await repository.findAll();
      expect(result).toEqual([testDomain]);
      expect(mockDbService.domain.findMany).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should find one domain by id', async () => {
      const input: FindDomainInput = { id: testDomain.id };
      const result = await repository.findOne(input);
      expect(result).toEqual(testDomain);
      expect(mockDbService.domain.findUnique).toHaveBeenCalledWith({
        where: { id: input.id },
      });
    });
  });

  describe('remove', () => {
    it('should remove a domain by id', async () => {
      const input: RemoveDomainInput = { id: testDomain.id };
      const result = await repository.remove(input);
      expect(result).toEqual(testDomain);
      expect(mockDbService.domain.delete).toHaveBeenCalledWith({
        where: { id: input.id },
      });
    });
  });

  describe('updateExpirationDate', () => {
    it('should update a domain expiration date', async () => {
      const mockedDate = new Date();
      const mockedResult = { ...testDomain, lastCheckedAt: mockedDate, expirationDate: testExpirationDate };
      mockDbService.domain.update.mockResolvedValueOnce(mockedResult);

      const input: UpdateExpirationDateInput = { id: testDomain.id, expirationDate: testExpirationDate };
      const result = await repository.updateExpirationDate(input);

      expect(result.expirationDate).toEqual(input.expirationDate);
      expect(result.lastCheckedAt).toEqual(mockedResult.lastCheckedAt);

      expect(mockDbService.domain.update).toHaveBeenCalledWith({
        where: { id: input.id },
        data: { expirationDate: input.expirationDate, lastCheckedAt: expect.any(Date) },
      });
    });
  });
});
