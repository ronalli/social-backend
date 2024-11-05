import { Inject, Injectable } from '@nestjs/common';
// import { UsersRepository } from '../infrastructure/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Repository } from 'typeorm';
import { UserCreateModel } from '../api/models/input/create-user.input.model';
import { bcryptService } from '../../../common/services/password-hash.service';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserOutputModel } from '../api/models/output/user.output.model';

@Injectable()
export class UsersService {
  constructor(
    // @InjectRepository(User) private readonly userRepository: Repository<User>
    private usersRepository: UsersRepository

  ) {
  }

 async deleteUser(id: number): Promise<void> {
    await this.usersRepository.delete(id)
  }

  async findUser(id: number): Promise<void> {
    return await this.usersRepository.findUserById(id)
  }
  //
  async findAllUser(): Promise<void> {
    return await this.usersRepository.findAllUser();
  }
  //
  async createUser(createModel: UserCreateModel): Promise<UserOutputModel> {

    const {password, login, email} = createModel;
    const hash = await bcryptService.generateHash(password);
    const createdAt = new Date().toISOString();

    const user = await this.usersRepository.createUser(login, email, hash, createdAt)

    return {
      id: user.id.toString(),
      createdAt: user.createdAt,
      email: user.email,
      login: user.login
    }
  }
}
