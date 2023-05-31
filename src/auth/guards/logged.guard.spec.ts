import { Test } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { LoggedGuard } from './logged.guard';
import { AuthJwtPayload } from '../auth.interfaces';
import { EncryptionService } from '@src/encryption/encryption.service';

describe(LoggedGuard.name, () => {
  let loggedGuard: LoggedGuard;
  let encryptionService: EncryptionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LoggedGuard,
        {
          provide: EncryptionService,
          useValue: {
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    loggedGuard = module.get<LoggedGuard>(LoggedGuard);
    encryptionService = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(loggedGuard).toBeDefined();
  });

  it('should allow a request with a valid token', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            get: () => 'Bearer token',
          },
          user: {},
        }),
      }),
    } as unknown as ExecutionContext;

    const authJwtPayload = {} as AuthJwtPayload;

    jest.spyOn(encryptionService, 'verify').mockImplementation(() => authJwtPayload);

    await expect(loggedGuard.canActivate(context)).resolves.toBe(true);
    expect(context.switchToHttp().getRequest().user).toEqual(authJwtPayload);
  });

  it('should reject a request with an invalid token', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            get: () => 'Bearer invalid',
          },
          user: {},
        }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(encryptionService, 'verify').mockImplementation(() => {
      throw new Error();
    });

    await expect(loggedGuard.canActivate(context)).rejects.toThrow('Unauthorized');
  });

  it('should reject a request without a token', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            get: () => undefined,
          },
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(loggedGuard.canActivate(context)).rejects.toThrow('Unauthorized');
  });
});
