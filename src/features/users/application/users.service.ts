import {Injectable} from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserCreateModel } from '../api/models/input/create-user.input.model';


@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {
  }

  async createUser(data: UserCreateModel) {
    return await this.usersRepository.createUser(data);
  }

  async deleteUser(id: string) {
    return await this.usersRepository.deleteUser(id);
  }

  async findUser(id: string) {
    return await this.usersRepository.findUserById(id)
  }
}
