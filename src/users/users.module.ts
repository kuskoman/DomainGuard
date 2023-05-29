import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { EncryptionModule } from '@src/encryption/encryption.module';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [EncryptionModule],
})
export class UsersModule {}
