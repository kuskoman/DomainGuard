import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';

describe(EncryptionService.name, () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionService],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  describe('hashPassword', () => {
    it('should return a string', async () => {
      const result = await service.hashPassword('testPassword');
      expect(typeof result).toBe('string');
    });

    it('should not return the same value', async () => {
      const result = await service.hashPassword('testPassword');
      expect(result).not.toEqual('testPassword');
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching passwords', async () => {
      const password = 'testPassword';
      const hashedPassword = await service.hashPassword(password);
      const result = await service.comparePassword(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const password = 'testPassword';
      const hashedPassword = await service.hashPassword(password);
      const result = await service.comparePassword('wrongPassword', hashedPassword);
      expect(result).toBe(false);
    });
  });

  describe('generateRandomString', () => {
    it('should return a string of the specified length', () => {
      const length = 16;
      const result = service.generateRandomString(length);
      expect(typeof result).toBe('string');
      expect(result.length).toBe(length);
    });

    it('should generate unique strings', () => {
      const length = 16;
      const result1 = service.generateRandomString(length);
      const result2 = service.generateRandomString(length);
      expect(result1).not.toEqual(result2);
    });

    it('should throw an error if length is less than 1', () => {
      expect(() => service.generateRandomString(0)).toThrow('Length must be greater than 0');
    });

    it('should throw an error if length is not an integer', () => {
      expect(() => service.generateRandomString(5.5)).toThrow('Length must be an integer');
    });

    it('should throw an error if length is negative', () => {
      expect(() => service.generateRandomString(-5)).toThrow('Length must be greater than 0');
    });
  });
});
