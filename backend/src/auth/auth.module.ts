import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EncryptionModule } from '@src/encryption/encryption.module';
import { UsersModule } from '@src/users/users.module';
import { LocalStrategy } from './strategies/local/local.strategy';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { REDIS_AUTH_STRATEGY } from './strategies/redis/redis.const';

@Module({
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
  imports: [EncryptionModule, UsersModule, PassportModule.register({ defaultStrategy: REDIS_AUTH_STRATEGY })],
  controllers: [AuthController],
})
export class AuthModule {}
