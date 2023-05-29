import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';

describe(LocalStrategy.name, () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return a user when valid credentials are provided', async () => {
      const user = { username: 'test', password: 'test' };
      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(user as unknown as User);

      const result = await localStrategy.validate(user.username, user.password);
      expect(result).toBe(user);
    });

    it('should throw UnauthorizedException when invalid credentials are provided', async () => {
      const user = { username: 'test', password: 'wrong' };
      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(null);

      await expect(localStrategy.validate(user.username, user.password)).rejects.toThrow(UnauthorizedException);
    });
  });
});
