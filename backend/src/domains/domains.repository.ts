import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { DbService } from '@src/lib/db/db.service';
import {
  CreateDomainInput,
  FindDomainsByUserInput,
  FindDomainInput,
  RemoveDomainInput,
  UpdateExpirationDateInput,
} from './domains.interfaces';

@Injectable()
export class DomainsRepository {
  constructor(private readonly db: DbService) {}

  public async create(input: CreateDomainInput) {
    const { name, userId } = input;

    const existingDomain = await this.db.domain.findFirst({
      where: { name },
    });

    if (existingDomain) {
      throw new UnprocessableEntityException(`Domain with name ${name} already exists`);
    }

    return this.db.domain.create({
      data: {
        name,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  public async findAllWithUser(input: FindDomainsByUserInput) {
    const { userId } = input;

    if (!userId) {
      return await this.db.domain.findMany();
    }

    return await this.db.domain.findMany({
      where: {
        user: { id: userId },
      },
    });
  }

  public async findOneWithUser(input: FindDomainInput) {
    const { id, userId } = input;

    if (!userId) {
      return await this.db.domain.findFirst({
        where: { id },
      });
    }

    return await this.db.domain.findFirst({
      where: {
        id,
        user: { id: userId },
      },
    });
  }

  public async removeWithUser(input: RemoveDomainInput) {
    const { id, userId } = input;

    if (!userId) {
      return await this.db.domain.delete({
        where: { id },
      });
    }

    return await this.db.domain.delete({
      where: {
        id,
        user: { id: userId },
      },
    });
  }

  public async findAll() {
    return await this.db.domain.findMany();
  }

  public async findOne(input: FindDomainInput) {
    const { id } = input;

    return await this.db.domain.findUnique({
      where: { id },
    });
  }

  public async remove(input: RemoveDomainInput) {
    const { id } = input;

    return await this.db.domain.delete({
      where: { id },
    });
  }

  public async updateExpirationDate(input: UpdateExpirationDateInput) {
    const { id, expirationDate } = input;

    return await this.db.domain.update({
      where: { id },
      data: { expirationDate, lastCheckedAt: new Date() },
    });
  }

  public async findDomainsNotCheckedInLastDays(days: number) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return await this.db.domain.findMany({
      where: {
        OR: [
          {
            lastCheckedAt: {
              lt: date,
            },
          },
          {
            lastCheckedAt: null,
          },
        ],
      },
    });
  }
}
