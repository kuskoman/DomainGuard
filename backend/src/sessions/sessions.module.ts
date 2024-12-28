import { Global, Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { EncryptionModule } from '@src/encryption/encryption.module';
import { SessionsController } from './sessions.controller';
import { RedisModule } from '@src/lib/redis/redis.module';

@Global()
@Module({
  providers: [SessionsService],
  imports: [EncryptionModule, RedisModule],
  exports: [SessionsService],
  controllers: [SessionsController],
})
export class SessionsModule {}
