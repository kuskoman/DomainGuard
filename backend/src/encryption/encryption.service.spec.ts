import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';
import { JwtModule } from '@nestjs/jwt';

const mockSecret = 'secret';

describe(EncryptionService.name, () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionService],
      imports: [JwtModule.register({ secret: mockSecret, signOptions: { expiresIn: '15m' } })],
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

  describe('sign', () => {
    it('should return a string', () => {
      const payload = { sub: 1, email: 'test@example.com' };
      const result = service.sign(payload);
      expect(typeof result).toBe('string');
    });
  });

  describe('verify', () => {
    it('should return the original payload', () => {
      const payload = { sub: 1, email: 'test@example.com' };
      const token = service.sign(payload);
      const result = service.verify(token);
      expect(result.sub).toBe(payload.sub);
      expect(result.email).toBe(payload.email);
    });
  });
});
