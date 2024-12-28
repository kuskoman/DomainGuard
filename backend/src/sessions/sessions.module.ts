import { Global, Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { RedisModule } from '@src/lib/redis/redis.module';
import { EncryptionModule } from '@src/encryption/encryption.module';

@Global()
@Module({
  providers: [SessionsService],
  imports: [RedisModule, EncryptionModule],
  exports: [SessionsService],
})
export class SessionsModule {}
