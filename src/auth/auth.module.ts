import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EncryptionModule } from '@src/encryption/encryption.module';
import { UsersModule } from '@src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
  imports: [EncryptionModule, UsersModule],
})
export class AuthModule {}
