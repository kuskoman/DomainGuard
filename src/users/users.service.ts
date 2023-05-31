import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbService } from '@src/db/db.service';
import { EncryptionService } from '@src/encryption/encryption.service';
import { UserCustomCreateInput, UserCustomUpdateInput } from './users.interfaces';

@Injectable()
export class UsersService {
  constructor(private readonly db: DbService, private readonly encryptionService: EncryptionService) {}

  public async createUser(userInput: UserCustomCreateInput) {
    const existingUser = await this.db.user.findUnique({ where: { email: userInput.email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const { password, ...restOfUser } = userInput;
    const passwordDigest = await this.encryptionService.hashPassword(password);
    const userData: Prisma.UserCreateInput = { ...restOfUser, passwordDigest };

    return this.db.user.create({ data: userData });
  }

  public async findAllUsers() {
    return this.db.user.findMany();
  }

  public async findUserByEmail(email: string) {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  public async findUserById(id: string) {
    const user = await this.db.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  public async updateUser(id: string, userData: UserCustomUpdateInput) {
    const user = await this.db.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.db.user.update({ where: { id }, data: userData });
  }

  public async deleteUser(id: string) {
    const user = await this.db.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.db.user.delete({ where: { id } });
  }
}
