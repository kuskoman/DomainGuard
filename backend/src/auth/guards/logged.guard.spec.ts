import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { LoggedGuard } from './logged.guard';
import { EncryptionService } from '@src/encryption/encryption.service';
import { AuthJwtPayload } from '../auth.interfaces';

describe(LoggedGuard.name, () => {
  let loggedGuard: LoggedGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggedGuard,
        {
          provide: EncryptionService,
          useValue: encryptionServiceMock,
        },
      ],
    }).compile();

    loggedGuard = module.get<LoggedGuard>(LoggedGuard);
  });

  it('should be defined', () => {
    expect(loggedGuard).toBeDefined();
  });

  it('should allow a request with a valid token', async () => {
    const request = {
      headers: {
        authorization: 'Bearer token',
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;

    const authJwtPayload = { sub: 'user-id' } as AuthJwtPayload;

    encryptionServiceMock.verify.mockImplementation(() => authJwtPayload);

    await expect(loggedGuard.canActivate(context)).resolves.toBe(true);
    expect((request as Record<string, unknown>).userId).toEqual(authJwtPayload.sub);
  });

  it('should reject a request with an invalid token', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer invalid',
          },
        }),
      }),
    } as unknown as ExecutionContext;

    encryptionServiceMock.verify.mockImplementation(() => {
      throw new Error();
    });

    await expect(loggedGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should reject a request without a token', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(loggedGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });
});

const encryptionServiceMock = {
  verify: jest.fn(),
};
