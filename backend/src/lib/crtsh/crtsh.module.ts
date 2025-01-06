import { Module } from '@nestjs/common';
import { CrtshService } from './crtsh.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [CrtshService],
  exports: [CrtshService],
  imports: [HttpModule],
})
export class CrtshModule {}
