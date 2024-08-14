import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {
  }

  async deleteUser(id: string) {
    return await this.usersRepository.delete(id);
  }

  async findUser(id: string) {
    return await this.usersRepository.findUserById(id)
  }
}
