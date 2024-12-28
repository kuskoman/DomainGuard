import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service';
import { EncryptionService } from '@src/encryption/encryption.service';
import { RedisService } from '@src/lib/redis/redis.service';
import { baseConfig } from '@src/config/base.config';

describe(SessionsService.name, () => {
  let service: SessionsService;

  const encryptionServiceMock = {
    hash: jest.fn(),
    compare: jest.fn(),
    generateRandomString: jest.fn(),
  };

  const redisServiceMock = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    listKeys: jest.fn(),
  };

  const baseConfigMock = {
    sessionTime: 3600,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        { provide: EncryptionService, useValue: encryptionServiceMock },
        { provide: RedisService, useValue: redisServiceMock },
        { provide: baseConfig.KEY, useValue: baseConfigMock },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  afterEach(jest.clearAllMocks);

  describe('createSession', () => {
    it('should create a session and return a token', async () => {
      const userId = 'testUserId';
      const sessionId = 'uniqueSessionId';
      const sessionSecret = 'randomSessionSecret';
      const hashedSecret = 'hashedSecret';
      const sessionTokenB64 = Buffer.from(`${userId}:${sessionId}:${sessionSecret}`).toString('base64');

      jest.spyOn(service as any, 'generateUniqueSessionId').mockResolvedValue(sessionId);
      encryptionServiceMock.generateRandomString.mockReturnValue(sessionSecret);
      encryptionServiceMock.hash.mockResolvedValue(hashedSecret);
      redisServiceMock.set.mockResolvedValue('OK');

      const result = await service.createSession(userId);

      expect(result).toEqual(sessionTokenB64);
      expect(encryptionServiceMock.generateRandomString).toHaveBeenCalledWith(32);
      expect(encryptionServiceMock.hash).toHaveBeenCalledWith(sessionSecret);
      expect(redisServiceMock.set).toHaveBeenCalledWith(
        `session:${userId}:${sessionId}`,
        expect.any(String),
        baseConfigMock.sessionTime,
      );
    });
  });

  describe('retrieveSession', () => {
    it('should return session data if session is valid', async () => {
      const base64SessionToken = Buffer.from('testUserId:session123:secret123').toString('base64');
      const sessionData = { sessionHash: 'hashedSecret', createdAt: new Date().toISOString() };

      redisServiceMock.get.mockResolvedValue(JSON.stringify(sessionData));
      encryptionServiceMock.compare.mockResolvedValue(true);

      const result = await service.retrieveSession(base64SessionToken);

      expect(result).toEqual({ userId: 'testUserId', sessionId: 'session123' });
      expect(redisServiceMock.get).toHaveBeenCalledWith('session:testUserId:session123');
      expect(encryptionServiceMock.compare).toHaveBeenCalledWith('secret123', 'hashedSecret');
    });

    it('should return null if session is not found', async () => {
      const base64SessionToken = Buffer.from('testUserId:session123:secret123').toString('base64');

      redisServiceMock.get.mockResolvedValue(null);

      const result = await service.retrieveSession(base64SessionToken);

      expect(result).toBeNull();
    });

    it('should return null if session secret is invalid', async () => {
      const base64SessionToken = Buffer.from('testUserId:session123:secret123').toString('base64');
      const sessionData = { sessionHash: 'hashedSecret', createdAt: new Date().toISOString() };

      redisServiceMock.get.mockResolvedValue(JSON.stringify(sessionData));
      encryptionServiceMock.compare.mockResolvedValue(false);

      const result = await service.retrieveSession(base64SessionToken);

      expect(result).toBeNull();
    });
  });

  describe('deleteSession', () => {
    it('should delete a session by userId and sessionId', async () => {
      redisServiceMock.del.mockResolvedValue(1);

      await service.deleteSession('testUserId', 'session123');

      expect(redisServiceMock.del).toHaveBeenCalledWith('session:testUserId:session123');
    });

    it('should delete a session by base64 session token', async () => {
      const base64SessionToken = Buffer.from('testUserId:session123:secret123').toString('base64');

      redisServiceMock.del.mockResolvedValue(1);

      await service.deleteSession(base64SessionToken);

      expect(redisServiceMock.del).toHaveBeenCalledWith('session:testUserId:session123');
    });
  });

  describe('private methods', () => {
    describe('generateUniqueSessionId', () => {
      it('should generate a unique session ID', async () => {
        redisServiceMock.exists.mockResolvedValue(0);
        encryptionServiceMock.generateRandomString.mockReturnValue('uniqueId');

        const result = await (service as any).generateUniqueSessionId('testUserId');

        expect(result).toBe('uniqueId');
        expect(encryptionServiceMock.generateRandomString).toHaveBeenCalledWith(10);
        expect(redisServiceMock.exists).toHaveBeenCalledWith('session:testUserId:uniqueId');
      });

      it('should retry if session ID already exists', async () => {
        redisServiceMock.exists
          .mockResolvedValueOnce(1) // First attempt exists
          .mockResolvedValueOnce(0); // Second attempt does not exist
        encryptionServiceMock.generateRandomString.mockReturnValueOnce('duplicateId').mockReturnValueOnce('uniqueId');

        const result = await (service as any).generateUniqueSessionId('testUserId');

        expect(result).toBe('uniqueId');
        expect(encryptionServiceMock.generateRandomString).toHaveBeenCalledTimes(2);
        expect(redisServiceMock.exists).toHaveBeenCalledWith('session:testUserId:duplicateId');
        expect(redisServiceMock.exists).toHaveBeenCalledWith('session:testUserId:uniqueId');
      });
    });

    describe('getSessionKey', () => {
      it('should return the correct session key', () => {
        const result = (service as any).getSessionKey('testUserId', 'session123');
        expect(result).toBe('session:testUserId:session123');
      });
    });
  });

  describe('getSessionsForUser', () => {
    it('should return all valid sessions for a user', async () => {
      const userId = 'testUserId';
      const sessionKeys = ['session:testUserId:session1', 'session:testUserId:session2'];
      const sessionData = [
        { sessionHash: 'hash1', createdAt: new Date().toISOString() },
        { sessionHash: 'hash2', createdAt: new Date().toISOString() },
      ];

      redisServiceMock.listKeys.mockResolvedValue(sessionKeys);
      redisServiceMock.get
        .mockResolvedValueOnce(JSON.stringify(sessionData[0]))
        .mockResolvedValueOnce(JSON.stringify(sessionData[1]));

      const result = await service.getSessionsForUser(userId);

      const sessionDataWithDate = sessionData.map((data) => ({ ...data, createdAt: new Date(data.createdAt) }));
      expect(result).toEqual(sessionDataWithDate);
      expect(redisServiceMock.listKeys).toHaveBeenCalledWith('session:testUserId:*');
      expect(redisServiceMock.get).toHaveBeenCalledTimes(2);
    });

    it('should filter out null sessions', async () => {
      const userId = 'testUserId';
      const sessionKeys = ['session:testUserId:session1', 'session:testUserId:session2'];

      redisServiceMock.listKeys.mockResolvedValue(sessionKeys);
      redisServiceMock.get
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(JSON.stringify({ sessionHash: 'hash2', createdAt: new Date().toISOString() }));

      const result = await service.getSessionsForUser(userId);

      expect(result).toEqual([{ sessionHash: 'hash2', createdAt: expect.any(Date) }]);
      expect(redisServiceMock.get).toHaveBeenCalledTimes(2);
    });

    it('should return an empty array if no sessions are found', async () => {
      const userId = 'testUserId';
      redisServiceMock.listKeys.mockResolvedValue([]);

      const result = await service.getSessionsForUser(userId);

      expect(result).toEqual([]);
      expect(redisServiceMock.listKeys).toHaveBeenCalledWith('session:testUserId:*');
      expect(redisServiceMock.get).not.toHaveBeenCalled();
    });
  });

  describe('deleteAllSessionsForUser', () => {
    it('should delete all sessions for a user', async () => {
      const userId = 'testUserId';
      const sessionKeys = ['session:testUserId:session1', 'session:testUserId:session2'];

      redisServiceMock.listKeys.mockResolvedValue(sessionKeys);
      redisServiceMock.del.mockResolvedValue(1);

      await service.deleteAllSessionsForUser(userId);

      expect(redisServiceMock.listKeys).toHaveBeenCalledWith('session:testUserId:*');
      expect(redisServiceMock.del).toHaveBeenCalledTimes(2);
      expect(redisServiceMock.del).toHaveBeenCalledWith('session:testUserId:session1');
      expect(redisServiceMock.del).toHaveBeenCalledWith('session:testUserId:session2');
    });

    it('should handle cases where no sessions exist', async () => {
      const userId = 'testUserId';

      redisServiceMock.listKeys.mockResolvedValue([]);

      await service.deleteAllSessionsForUser(userId);

      expect(redisServiceMock.listKeys).toHaveBeenCalledWith('session:testUserId:*');
      expect(redisServiceMock.del).not.toHaveBeenCalled();
    });
  });
});
