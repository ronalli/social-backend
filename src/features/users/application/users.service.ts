import { Injectable } from '@nestjs/common';
// import { UsersRepository } from '../infrastructure/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Repository } from 'typeorm';
import { UserCreateModel } from '../api/models/input/create-user.input.model';
import { bcryptService } from '../../../common/services/password-hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
    // private usersRepository: UsersRepository

  ) {
  }

 async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findUser(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({id})
  }

  async findAllUser(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async createUser(createModel: UserCreateModel): Promise<User> {
    const user = new User();

    const {password, login, email} = createModel;

    const hash = await bcryptService.generateHash(password);

    user.login = login;
    user.email = email;
    user.hash = hash;
    user.createdAt = new Date().toISOString();

    return await this.userRepository.save(user);
  }
}
