import { Body, Controller, Logger, Post, UnauthorizedException } from '@nestjs/common';
import { UserLoginDto } from './dto/userLoginDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: UserLoginDto) {
    this.logger.debug(`Login attempt for ${loginDto.email}`);
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      this.logger.debug(`Login attempt failed for ${loginDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`Login attempt succeeded for ${loginDto.email}`);
    return this.authService.login(user);
  }
}
