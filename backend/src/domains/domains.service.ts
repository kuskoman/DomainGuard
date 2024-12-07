import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { DomainsRepository } from './domains.repository';
import { DomainsExpirationService } from './domains-expiration/domains-expiration.service';
import {
  CreateDomainInput,
  FindDomainInput,
  FindDomainsByUserInput,
  RemoveDomainInput,
  UpdateExpirationDateInput,
} from './domains.interfaces';

@Injectable()
export class DomainsService {
  private readonly logger = new Logger(DomainsService.name);

  constructor(
    private readonly repository: DomainsRepository,
    private readonly expirationService: DomainsExpirationService,
  ) {}

  public async create(name: string, userId: string) {
    const input: CreateDomainInput = { name, userId };
    const domainResponse = await this.repository.create(input);

    // todo: use a queue, or cqrs, or something else to handle this in the background
    (async () => {
      try {
        await this.updateDomainExpirationDate(domainResponse.id);
      } catch (error) {
        this.logger.error(`Error updating domain expiration date: ${JSON.stringify(error)}`);
      }
    })();

    return domainResponse;
  }

  public async findAllWithUser(userId: string) {
    const input: FindDomainsByUserInput = { userId };
    return this.repository.findAllWithUser(input);
  }

  public async findOneWithUser(id: string, userId: string) {
    const input: FindDomainInput = { id, userId };
    const domain = await this.repository.findOneWithUser(input);
    if (!domain) {
      throw new NotFoundException(`Domain with id ${id} not found`);
    }
    return domain;
  }

  public async removeWithUser(id: string, userId: string) {
    const input: FindDomainInput = { id };
    const domain = await this.repository.findOne(input);
    if (!domain || domain.userId !== userId) {
      throw new NotFoundException(`Domain with id ${id} not found`);
    }
    const removeInput: RemoveDomainInput = { id };
    return this.repository.removeWithUser(removeInput);
  }

  public async updateDomainExpirationDateWithUser(id: string, userId: string) {
    const input: FindDomainInput = { id };
    const domain = await this.repository.findOne(input);
    if (!domain || domain.userId !== userId) {
      throw new NotFoundException(`Domain with id ${id} not found`);
    }

    const expirationDate = await this.expirationService.getExpirationDate(domain.name);
    if (!expirationDate) {
      throw new UnprocessableEntityException('Could not get expiration date');
    }

    const updateInput: UpdateExpirationDateInput = { id, expirationDate };
    return this.repository.updateExpirationDate(updateInput);
  }

  public async findAll() {
    return this.repository.findAll();
  }

  public async findOne(id: string) {
    const input: FindDomainInput = { id };
    const domain = await this.repository.findOne(input);
    if (!domain) {
      throw new NotFoundException(`Domain with id ${id} not found`);
    }
    return domain;
  }

  public async remove(id: string) {
    const input: FindDomainInput = { id };
    const domain = await this.repository.findOne(input);
    if (!domain) {
      throw new NotFoundException(`Domain with id ${id} not found`);
    }
    const removeInput: RemoveDomainInput = { id };
    return this.repository.remove(removeInput);
  }

  public async updateDomainExpirationDate(id: string) {
    const input: FindDomainInput = { id };
    const domain = await this.repository.findOne(input);
    if (!domain) {
      throw new NotFoundException(`Domain with id ${id} not found`);
    }

    const expirationDate = await this.expirationService.getExpirationDate(domain.name);
    if (!expirationDate) {
      throw new UnprocessableEntityException('Could not get expiration date');
    }

    const updateInput: UpdateExpirationDateInput = { id, expirationDate };
    return this.repository.updateExpirationDate(updateInput);
  }
}
