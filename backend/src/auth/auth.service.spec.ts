import { Test } from '@nestjs/testing';
import { UsersService } from '@src/users/users.service';
import { EncryptionService } from '@src/encryption/encryption.service';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { SessionsService } from '@src/sessions/sessions.service';

const mockUser = {
  id: '1',
  email: 'test@example.com',
  passwordDigest: 'encryptedPassword',
} as User;

const usersServiceMock = {
  findUserByEmail: jest.fn().mockResolvedValue(mockUser),
};

const encryptionServiceMock = {
  compare: jest.fn().mockResolvedValue(true),
};

const sessionsServiceMock = {
  createSession: jest.fn().mockResolvedValue('sessionToken'),
};

describe(AuthService.name, () => {
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: EncryptionService,
          useValue: encryptionServiceMock,
        },
        {
          provide: SessionsService,
          useValue: sessionsServiceMock,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterEach(jest.clearAllMocks);

  describe('validateUser', () => {
    it('should return a user when the email and password are valid', async () => {
      const result = await authService.validateUser('test@example.com', 'password');
      expect(result).toEqual(mockUser);
      expect(usersServiceMock.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(encryptionServiceMock.compare).toHaveBeenCalledWith('password', mockUser.passwordDigest);
    });

    it('should return null when the password is invalid', async () => {
      encryptionServiceMock.compare.mockResolvedValueOnce(false);
      const result = await authService.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
      expect(usersServiceMock.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(encryptionServiceMock.compare).toHaveBeenCalledWith('password', mockUser.passwordDigest);
    });

    it('should throw an error if the user is not found', async () => {
      usersServiceMock.findUserByEmail.mockResolvedValueOnce(null);
      await expect(authService.validateUser('nonexistent@example.com', 'password')).rejects.toThrowError();
    });
  });

  describe('login', () => {
    it('should return an access token for the user', async () => {
      const result = await authService.login(mockUser);
      expect(result).toEqual({ access_token: 'sessionToken' });
      expect(sessionsServiceMock.createSession).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw an error if session creation fails', async () => {
      sessionsServiceMock.createSession.mockRejectedValueOnce(new Error('Session creation failed'));
      await expect(authService.login(mockUser)).rejects.toThrow('Session creation failed');
    });
  });
});
