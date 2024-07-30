import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserCreateModel } from '../api/models/input/create-user.input.model';
import { UsersQueryRepository } from '../infrastructure/users.query-repository';
import { bcryptService } from '../../../common/services/password-hash.service';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../domain/user.entity';


@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository, private usersQueryRepository: UsersQueryRepository, @InjectModel(User.name) private UserModel: UserModelType) {
  }

  async createUser(data: UserCreateModel) {

    const response = await this.usersQueryRepository.doesExistByLoginOrEmail(data.login, data.email)

    if (!response) {
      throw new BadRequestException();
    }

    const hash = await bcryptService.generateHash(data.password);

    const user = new this.UserModel({
      _id: new Types.ObjectId(),
      email: data.email,
      login: data.login,
      hash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: null,
        expirationDate: null,
        isConfirmed: true
      }
    });

    const createdUserId: string = await this.usersRepository.createUser(user)

    return createdUserId;
  }

  async deleteUser(id: string) {
    return await this.usersRepository.deleteUser(id);
  }

  async findUser(id: string) {
    return await this.usersRepository.findUserById(id)
  }
}
