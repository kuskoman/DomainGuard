import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { redisConfig, RedisConfig } from '@src/config/redis.config';

const redisClientMock = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(),
  exists: jest.fn(),
  on: jest.fn(),
};

jest.mock('redis', () => ({
  createClient: jest.fn(() => redisClientMock),
}));

describe(RedisService.name, () => {
  let service: RedisService;

  const redisConfigMock: RedisConfig = {
    url: 'redis://localhost:6379',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisService, { provide: redisConfig.KEY, useValue: redisConfigMock }],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  describe('onApplicationBootstrap', () => {
    it('should connect to Redis', async () => {
      await service.onApplicationBootstrap();
      expect(redisClientMock.connect).toHaveBeenCalled();
    });
  });

  describe('onApplicationShutdown', () => {
    it('should disconnect from Redis', async () => {
      await service.onApplicationShutdown();
      expect(redisClientMock.disconnect).toHaveBeenCalled();
    });
  });

  describe('set', () => {
    it('should set a value in Redis with expiration', async () => {
      redisClientMock.set.mockResolvedValue('OK');

      const result = await service.set('key', 'value', 3600);
      expect(redisClientMock.set).toHaveBeenCalledWith('key', 'value', { EX: 3600 });
      expect(result).toBe('OK');
    });

    it('should set a value in Redis without expiration', async () => {
      redisClientMock.set.mockResolvedValue('OK');

      const result = await service.set('key', 'value');
      expect(redisClientMock.set).toHaveBeenCalledWith('key', 'value', { EX: undefined });
      expect(result).toBe('OK');
    });
  });

  describe('get', () => {
    it('should get a value from Redis', async () => {
      redisClientMock.get.mockResolvedValue('value');

      const result = await service.get('key');
      expect(redisClientMock.get).toHaveBeenCalledWith('key');
      expect(result).toBe('value');
    });
  });

  describe('del', () => {
    it('should delete a key from Redis', async () => {
      redisClientMock.del.mockResolvedValue(1);

      const result = await service.del('key');
      expect(redisClientMock.del).toHaveBeenCalledWith('key');
      expect(result).toBe(1);
    });
  });

  describe('exists', () => {
    it('should check if a key exists in Redis', async () => {
      redisClientMock.exists.mockResolvedValue(1);

      const result = await service.exists('key');
      expect(redisClientMock.exists).toHaveBeenCalledWith('key');
      expect(result).toBe(1);
    });
  });

  describe('listKeys', () => {
    it('should list keys matching a pattern in Redis', async () => {
      redisClientMock.keys.mockResolvedValue(['key1', 'key2']);

      const result = await service.listKeys('pattern*');
      expect(redisClientMock.keys).toHaveBeenCalledWith('pattern*');
      expect(result).toEqual(['key1', 'key2']);
    });
  });
});
