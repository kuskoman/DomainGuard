import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DbService } from '@src/db/db.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaPromise, User } from '@prisma/client';

describe(UsersService.name, () => {
  let service: UsersService;
  let dbService: DbService;

  const mockDbService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: DbService, useValue: mockDbService }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    dbService = module.get<DbService>(DbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should throw an error if email already exists', async () => {
      jest.spyOn(dbService.user, 'findUnique').mockResolvedValueOnce({} as User);

      await expect(service.createUser({ email: 'test@test.com' })).rejects.toThrow(BadRequestException);
    });

    it('should create a user', async () => {
      jest.spyOn(dbService.user, 'findUnique').mockResolvedValueOnce(null);
      jest.spyOn(dbService.user, 'create').mockResolvedValueOnce({ email: 'test@test.com' } as User);

      const user = await service.createUser({ email: 'test@test.com' });
      expect(user).toEqual({ email: 'test@test.com' });
    });
  });

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      const result = [{ name: 'Test User' }];
      jest.spyOn(dbService.user, 'findMany').mockResolvedValueOnce(result as unknown as PrismaPromise<User[]>);

      expect(await service.findAllUsers()).toBe(result);
    });
  });

  describe('findUserById', () => {
    it('should return a user if it exists', async () => {
      const result = { name: 'Test User' };
      jest.spyOn(dbService.user, 'findUnique').mockResolvedValueOnce(result as unknown as User);

      expect(await service.findUserById('1')).toBe(result);
    });

    it('should throw an error if user does not exist', async () => {
      jest.spyOn(dbService.user, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.findUserById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should return updated user if it exists', async () => {
      const result = { name: 'Updated User' };
      jest.spyOn(dbService.user, 'findUnique').mockResolvedValueOnce({ name: 'Test User' } as unknown as User);
      jest.spyOn(dbService.user, 'update').mockResolvedValueOnce(result as unknown as User);

      expect(await service.updateUser('1', { name: 'Updated User' })).toBe(result);
    });

    it('should throw an error if user does not exist', async () => {
      jest.spyOn(dbService.user, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.updateUser('1', { name: 'Updated User' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should return deleted user if it exists', async () => {
      const result = { name: 'Deleted User' };
      jest.spyOn(dbService.user, 'findUnique').mockResolvedValueOnce(result as unknown as User);
      jest.spyOn(dbService.user, 'delete').mockResolvedValueOnce(result as unknown as User);

      expect(await service.deleteUser('1')).toBe(result);
    });

    it('should throw an error if user does not exist', async () => {
      jest.spyOn(dbService.user, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.deleteUser('1')).rejects.toThrow(NotFoundException);
    });
  });
});
