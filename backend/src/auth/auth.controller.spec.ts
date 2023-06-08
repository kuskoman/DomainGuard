import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/userLoginDto';

describe(AuthController.name, () => {
  let authController: AuthController;

  const authServiceMock = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should return a JWT when a valid user attempts to login', async () => {
    const user = { email: 'test@test.com', password: 'password' };
    const token = 'fake_token';

    const loginDto: UserLoginDto = {
      email: user.email,
      password: user.password,
    };

    authServiceMock.validateUser.mockResolvedValue(user);
    authServiceMock.login.mockResolvedValue(token);

    await expect(authController.login(loginDto)).resolves.toEqual(token);
  });

  it('should throw UnauthorizedException when an invalid user attempts to login', async () => {
    const user = { email: 'invalid@test.com', password: 'password' };

    const loginDto: UserLoginDto = {
      email: user.email,
      password: user.password,
    };

    authServiceMock.validateUser.mockResolvedValue(null);

    await expect(authController.login(loginDto)).rejects.toThrow('Invalid credentials');
  });
});
