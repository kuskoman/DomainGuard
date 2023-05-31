import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { EncryptionModule } from '@src/encryption/encryption.module';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [EncryptionModule],
  controllers: [UsersController],
})
export class UsersModule {}
