import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from '@src/db/db.service';
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

  it('should create a domain', async () => {
    const input: CreateDomainInput = { name: testDomain.name, userId: testDomain.userId };
    const result = await repository.create(input);
    expect(result).toEqual(testDomain);
  });

  it('should find all domains for a user', async () => {
    const input: FindDomainsByUserInput = { userId: testDomain.userId };
    const result = await repository.findAllWithUser(input);
    expect(result).toEqual([testDomain]);
  });

  it('should find one domain by id for a user', async () => {
    const input: FindDomainInput = { id: testDomain.id, userId: testDomain.userId };
    const result = await repository.findOneWithUser(input);
    expect(result).toEqual(testDomain);
  });

  it('should delete a domain by id for a user', async () => {
    const input: RemoveDomainInput = { id: testDomain.id };
    const result = await repository.removeWithUser(input);
    expect(result).toEqual(testDomain);
  });

  it('should find all domains', async () => {
    const result = await repository.findAll();
    expect(result).toEqual([testDomain]);
  });

  it('should find one domain by id', async () => {
    const input: FindDomainInput = { id: testDomain.id };
    const result = await repository.findOne(input);
    expect(result).toEqual(testDomain);
  });

  it('should delete a domain by id', async () => {
    const input: RemoveDomainInput = { id: testDomain.id };
    const result = await repository.remove(input);
    expect(result).toEqual(testDomain);
  });

  it('should update a domain expiration date', async () => {
    const input: UpdateExpirationDateInput = { id: testDomain.id, expirationDate: new Date() };
    const result = await repository.updateExpirationDate(input);
    expect(result).toEqual(testDomain);
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
