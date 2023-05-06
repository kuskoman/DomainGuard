import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '@src/db/db.service';

@Injectable()
export class DomainsService {
  constructor(private readonly db: DbService) {}

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
}
