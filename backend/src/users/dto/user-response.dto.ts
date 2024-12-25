import { User } from '@prisma/client';

export class UserResponseDto {
  constructor(user: User) {
    this.email = user.email;
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }

  email: string;
  id: string;
  firstName: string | null;
  lastName: string | null;
}
