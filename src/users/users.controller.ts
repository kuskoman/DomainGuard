import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerDto: UserRegisterDto) {
    const user = await this.usersService.createUser(registerDto);
    return new UserResponseDto(user);
  }
}
