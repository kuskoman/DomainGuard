import { Test } from '@nestjs/testing';
import { UsersService } from '@src/users/users.service';
import { EncryptionService } from '@src/encryption/encryption.service';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { baseConfig } from '@src/config/base.config';

const mockUser = {
  id: '1',
  email: 'test@example.com',
  passwordDigest: 'encryptedPassword',
} as User;

const baseConfigMock = {
  sessionTime: 3600,
};

const mockUsersService = {
  findUserByEmail: jest.fn().mockResolvedValue(mockUser),
};

const mockEncryptionService = {
  comparePassword: jest.fn().mockResolvedValue(true),
  sign: jest.fn().mockReturnValue('token'),
};

describe(AuthService.name, () => {
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: EncryptionService,
          useValue: mockEncryptionService,
        },
        {
          provide: baseConfig.KEY,
          useValue: baseConfigMock,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return a user when the email and password are valid', async () => {
      await expect(authService.validateUser('test@example.com', 'password')).resolves.toEqual(mockUser);
    });

    it('should return null when the password is invalid', async () => {
      mockEncryptionService.comparePassword.mockResolvedValue(false);
      await expect(authService.validateUser('test@example.com', 'password')).resolves.toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token for the user', async () => {
      await expect(authService.login(mockUser)).resolves.toEqual({ access_token: 'token' });
    });
  });
});
