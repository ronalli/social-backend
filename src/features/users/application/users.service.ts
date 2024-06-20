import {Injectable} from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { IUserInputModel } from '../api/models/all.types';


@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {
  }

  async createUser(data: IUserInputModel) {
    return await this.usersRepository.createUser(data);
  }

  async deleteUser(id: string) {
    return await this.usersRepository.deleteUser(id);
  }

  async findUser(id: string) {
    return await this.usersRepository.findUserById(id)
  }
}
