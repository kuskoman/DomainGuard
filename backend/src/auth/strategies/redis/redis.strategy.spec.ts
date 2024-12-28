import { Test, TestingModule } from '@nestjs/testing';
import { RedisSessionStrategy } from './redis.strategy';
import { SessionsService } from '@src/sessions/sessions.service';

describe(RedisSessionStrategy.name, () => {
  let strategy: RedisSessionStrategy;

  const sessionsServiceMock = {
    retrieveSession: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisSessionStrategy, { provide: SessionsService, useValue: sessionsServiceMock }],
    }).compile();

    strategy = module.get<RedisSessionStrategy>(RedisSessionStrategy);
  });

  afterEach(jest.clearAllMocks);

  it('should return null if authorization header is missing', async () => {
    const req = { headers: new Map() } as unknown as Request;

    const result = await strategy.validate(req);

    expect(result).toBeNull();
  });

  it('should return null if token is missing', async () => {
    const req = { headers: new Map([['authorization', 'Bearer']]) } as unknown as Request;

    const result = await strategy.validate(req);

    expect(result).toBeNull();
  });

  it('should return null if session is invalid', async () => {
    const req = { headers: new Map([['authorization', 'Bearer invalidToken']]) } as unknown as Request;
    sessionsServiceMock.retrieveSession.mockResolvedValue(null);

    const result = await strategy.validate(req);

    expect(result).toBeNull();
  });

  it('should return session data if valid token is provided', async () => {
    const req = { headers: new Map([['authorization', 'Bearer validToken']]) } as unknown as Request;
    const sessionData = { userId: 'testUser', sessionId: 'session123' };
    sessionsServiceMock.retrieveSession.mockResolvedValue(sessionData);

    const result = await strategy.validate(req);

    expect(result).toEqual(sessionData);
    expect(sessionsServiceMock.retrieveSession).toHaveBeenCalledWith('validToken');
  });
});
