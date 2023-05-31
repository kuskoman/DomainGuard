import { User } from '@prisma/client';

export class UserResponseDto {
  constructor(user: User) {
    this.email = user.email;
    this.id = user.id;
  }

  email: string;
  id: string;
}
