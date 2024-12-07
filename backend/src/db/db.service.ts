import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DbService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(DbService.name);

  async onModuleInit() {
    await this.$connect();

    this.logger.log('Database connected');
  }
}
