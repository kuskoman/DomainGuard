import { Module } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BASE_CONFIG_KEY, BaseConfig } from '@src/config/base.config';

@Module({
  providers: [EncryptionService],
  exports: [EncryptionService],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { jwtSecret } = configService.getOrThrow<BaseConfig>(BASE_CONFIG_KEY);
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '15m' },
        };
      },
    }),
  ],
})
export class EncryptionModule {}
