import { Global, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '@src/db/db.service';
import { DomainsExpirationService } from './domains-expiration/domains-expiration.service';

@Global()
@Injectable()
export class DomainsService {
  constructor(private readonly db: DbService, private readonly expirationService: DomainsExpirationService) {}

  public async create(domain: string, userId: string) {
    return this.db.domain.create({
      data: {
        name: domain,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  public async findAll(userId: string) {
    return this.db.domain.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  public async findOne(id: string, userId: string) {
    return this.db.domain.findFirst({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });
  }

  public async remove(id: string, userId: string) {
    const domain = await this.db.domain.findUnique({
      where: {
        id,
      },
    });

    if (!domain || domain.userId !== userId) {
      throw new NotFoundException(`Domain with id ${id} not found`);
    }

    return this.db.domain.delete({
      where: {
        id,
      },
    });
  }

  public async updateDomainExpirationDate(id: string, userId: string) {
    const domain = await this.db.domain.findUnique({
      where: {
        id,
      },
    });

    if (!domain || domain.userId !== userId) {
      throw new NotFoundException(`Domain with id ${id} not found`);
    }

    const expirationDate = await this.expirationService.getExpirationDate(domain.name);
    if (!expirationDate) {
      throw new HttpException('Could not get expiration date', 424);
    }

    return this.db.domain.update({
      where: {
        id,
      },
      data: {
        expirationDate,
      },
    });
  }
}
