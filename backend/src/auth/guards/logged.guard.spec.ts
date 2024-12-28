import { Test, TestingModule } from '@nestjs/testing';
import { LoggedGuard } from './logged.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SessionsService } from '@src/sessions/sessions.service';

describe(LoggedGuard.name, () => {
  let guard: LoggedGuard;
  let sessionsServiceMock: jest.Mocked<SessionsService>;

  beforeEach(async () => {
    sessionsServiceMock = {
      retrieveSession: jest.fn(),
    } as unknown as jest.Mocked<SessionsService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggedGuard, { provide: SessionsService, useValue: sessionsServiceMock }],
    }).compile();

    guard = module.get<LoggedGuard>(LoggedGuard);
  });

  afterEach(jest.clearAllMocks);

  it('should throw UnauthorizedException if authorization header is missing', async () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if authorization header is invalid', async () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: 'InvalidHeader' } }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if session token is invalid', async () => {
    sessionsServiceMock.retrieveSession.mockResolvedValue(null);

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: 'Bearer invalidToken' } }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
    expect(sessionsServiceMock.retrieveSession).toHaveBeenCalledWith('invalidToken');
  });

  it('should return true and attach userId and sessionId to request if session token is valid', async () => {
    const sessionData = { userId: 'testUser', sessionId: 'session123' };
    sessionsServiceMock.retrieveSession.mockResolvedValue(sessionData);

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: 'Bearer validToken' } }),
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(sessionsServiceMock.retrieveSession).toHaveBeenCalledWith('validToken');
  });
});
