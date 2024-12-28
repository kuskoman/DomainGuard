import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { RedisModule } from '@src/lib/redis/redis.module';
import { EncryptionModule } from '@src/encryption/encryption.module';

@Module({
  providers: [SessionsService],
  imports: [RedisModule, EncryptionModule],
})
export class SessionsModule {}
