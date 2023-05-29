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
});
