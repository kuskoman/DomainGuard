import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { EncryptionService } from '@src/encryption/encryption.service';
import { UsersService } from '@src/users/users.service';
import { SessionsService } from '@src/sessions/sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly encryptionService: EncryptionService,
    private readonly sessionsService: SessionsService,
  ) {}

  public async validateUser(email: string, password: string) {
    const user = await this.usersService.findUserByEmail(email);
    const isPasswordValid = await this.encryptionService.compare(password, user.passwordDigest);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  public async login(user: User) {
    const token = await this.sessionsService.createSession(user.id);
    return { access_token: token };
  }
}
