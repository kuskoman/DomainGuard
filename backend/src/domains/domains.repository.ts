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

  public findAllWithUser(input: FindDomainsByUserInput) {
    const { userId } = input;

    if (!userId) {
      return this.db.domain.findMany();
    }

    return this.db.domain.findMany({
      where: {
        user: { id: userId },
      },
    });
  }

  public findOneWithUser(input: FindDomainInput) {
    const { id, userId } = input;

    if (!userId) {
      return this.db.domain.findFirst({
        where: { id },
      });
    }

    return this.db.domain.findFirst({
      where: {
        id,
        user: { id: userId },
      },
    });
  }

  public removeWithUser(input: RemoveDomainInput) {
    const { id, userId } = input;

    if (!userId) {
      return this.db.domain.delete({
        where: { id },
      });
    }

    return this.db.domain.delete({
      where: {
        id,
        user: { id: userId },
      },
    });
  }

  public findAll() {
    return this.db.domain.findMany();
  }

  public findOne(input: FindDomainInput) {
    const { id } = input;

    return this.db.domain.findUnique({
      where: { id },
    });
  }

  public remove(input: RemoveDomainInput) {
    const { id } = input;

    return this.db.domain.delete({
      where: { id },
    });
  }

  public updateExpirationDate(input: UpdateExpirationDateInput) {
    const { id, expirationDate } = input;

    return this.db.domain.update({
      where: { id },
      data: { expirationDate, lastCheckedAt: new Date() },
    });
  }
}
