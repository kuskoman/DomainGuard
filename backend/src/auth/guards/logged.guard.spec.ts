import { Test, TestingModule } from '@nestjs/testing';
import { LoggedGuard } from './logged.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe(LoggedGuard.name, () => {
  let guard: LoggedGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggedGuard],
    }).compile();

    guard = module.get<LoggedGuard>(LoggedGuard);
  });

  afterEach(jest.clearAllMocks);

  it('should throw UnauthorizedException if userId and sessionId are not attached to request', async () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if userId or sessionId is missing', async () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({ sessionId: 'session123' }), // Missing userId
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);

    const mockExecutionContextMissingSessionId = {
      switchToHttp: () => ({
        getRequest: () => ({ userId: 'testUser' }), // Missing sessionId
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(mockExecutionContextMissingSessionId)).rejects.toThrow(UnauthorizedException);
  });

  it('should return true if userId and sessionId are present on the request', async () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({ userId: 'testUser', sessionId: 'session123' }),
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
  });
});
