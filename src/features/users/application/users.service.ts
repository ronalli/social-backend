import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserOutputModel } from '../api/models/output/user.output.model';
import { validate as isValidUUID } from 'uuid';
import { UsersTypeOrmRepository } from '../infrastructure/users.typeorm.repository';

@Injectable()
export class UsersService {
  constructor(
    private usersTypeORMRepository: UsersTypeOrmRepository,
    private usersRepository: UsersRepository,) {}

  async deleteUser(id: string): Promise<boolean> {
    if (!isValidUUID(id)) {
      throw new NotFoundException();
    }

    return await this.usersTypeORMRepository.delete(id);
  }

  async findUser(id: string): Promise<UserOutputModel> {
    return await this.usersRepository.findUserById(id);
  }

  async findAllUser(): Promise<void> {
    return await this.usersRepository.findAllUser();
  }
}
