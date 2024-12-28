import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoggedGuard } from '@src/auth/guards/logged.guard';
import { UserId } from '@src/auth/decorators/userId.decorator';
import { UserRegisterResponseDto } from './dto/user-register-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({ type: UserRegisterResponseDto })
  @Post('register')
  async register(@Body() registerDto: UserRegisterDto): Promise<UserRegisterResponseDto> {
    return await this.usersService.registerUser(registerDto);
  }

  @UseGuards(LoggedGuard)
  @ApiOkResponse({ type: UserResponseDto })
  @Get('me')
  async me(@UserId() userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findUserById(userId);
    return new UserResponseDto(user);
  }
}
