import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { EncryptionService } from '@src/encryption/encryption.service';
import { UsersService } from '@src/users/users.service';
import { AuthJwtPayload } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly encryptionService: EncryptionService) {}

  public async validateUser(email: string, password: string) {
    const user = await this.usersService.findUserByEmail(email);
    const isPasswordValid = await this.encryptionService.comparePassword(password, user.passwordDigest);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  public async login(user: User) {
    const payload: AuthJwtPayload = { email: user.email, sub: user.id };
    const token = this.encryptionService.sign(payload);
    return { access_token: token };
  }
}
