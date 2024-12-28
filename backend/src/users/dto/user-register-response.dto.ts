import { User } from '@prisma/client';
import { UserResponseDto } from './user-response.dto';

export class UserRegisterResponseDto {
  user: UserResponseDto;
  accessToken: string;

  constructor(user: User, accessToken: string) {
    this.user = new UserResponseDto(user);
    this.accessToken = accessToken;
  }
}
