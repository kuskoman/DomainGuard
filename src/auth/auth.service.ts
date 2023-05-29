import { Injectable } from '@nestjs/common';
import { EncryptionService } from '@src/encryption/encryption.service';
import { UsersService } from '@src/users/users.service';

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
}
