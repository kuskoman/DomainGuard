import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DbService } from '@src/db/db.service';

@Injectable()
export class UsersService {
  constructor(private readonly db: DbService) {}

  public async createUser(user: any) {
    const existingUser = await this.db.user.findUnique({ where: { email: user.email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    return this.db.user.create({ data: user });
  }

  public async findAllUsers() {
    return this.db.user.findMany();
  }

  public async findUserById(id: string) {
    const user = await this.db.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  public async updateUser(id: string, userData: any) {
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
