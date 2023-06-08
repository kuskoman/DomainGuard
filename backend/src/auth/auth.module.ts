import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EncryptionModule } from '@src/encryption/encryption.module';
import { UsersModule } from '@src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
  imports: [EncryptionModule, UsersModule],
  controllers: [AuthController],
})
export class AuthModule {}
