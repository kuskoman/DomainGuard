import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DbService } from '@src/lib/db/db.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaPromise, User } from '@prisma/client';
import { EncryptionService } from '@src/encryption/encryption.service';

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

  const encryptionServiceMock = {
    hashPassword: jest.fn(() => 'hashedPassword'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: DbService, useValue: mockDbService },
        { provide: EncryptionService, useValue: encryptionServiceMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    dbService = module.get<DbService>(DbService);
  });

  describe('createUser', () => {
    it('should throw an error if email already exists', async () => {
      jest.spyOn(dbService.user, 'findUnique').mockResolvedValueOnce({} as User);

      await expect(service.createUser({ email: 'test@test.com', password: 'dupa' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a user', async () => {
      jest.spyOn(dbService.user, 'findUnique').mockResolvedValueOnce(null);
      jest.spyOn(dbService.user, 'create').mockResolvedValueOnce({ email: 'test@test.com' } as User);

      const user = await service.createUser({ email: 'test@test.com', password: 'test' });
      expect(user).toEqual({ email: 'test@test.com' });
    });

    it('should hash the password', async () => {
      jest.spyOn(dbService.user, 'findUnique').mockResolvedValueOnce(null);
      jest.spyOn(dbService.user, 'create').mockResolvedValueOnce({ email: 'test@test.com' } as User);

      await service.createUser({ email: 'test@test.com', password: 'test' });
      expect(encryptionServiceMock.hashPassword).toHaveBeenCalledWith('test');

      expect(dbService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@test.com',
          passwordDigest: 'hashedPassword',
        },
      });
    });
  });

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      const result = [{ name: 'Test User' }];
      jest.spyOn(dbService.user, 'findMany').mockResolvedValueOnce(result as unknown as PrismaPromise<User[]>);

      expect(await service.findAllUsers()).toBe(result);
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user if it exists', async () => {
      const result = { name: 'Test User' };
      jest.spyOn(dbService.user, 'findUnique').mockResolvedValueOnce(result as unknown as User);

      expect(await service.findUserByEmail('test@email.com')).toBe(result);
    });

    it('should throw an error if user does not exist', async () => {
      jest.spyOn(dbService.user, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.findUserByEmail('test@email.com')).rejects.toThrow(NotFoundException);
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

      expect(await service.updateUser('1', { email: 'Updated User' })).toBe(result);
    });

    it('should throw an error if user does not exist', async () => {
      jest.spyOn(dbService.user, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.updateUser('1', { email: 'Updated User' })).rejects.toThrow(NotFoundException);
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
