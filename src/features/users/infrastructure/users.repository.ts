import {ObjectId} from "mongodb";
import { BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {UsersQueryRepository} from './users.query-repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { bcryptService } from '../../../common/services/password-hash.service';
import { UserCreateModel } from '../api/models/input/create-user.input.model';
import { Types } from 'mongoose';
import { UserOutputModel } from '../api/models/output/user.output.model';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType , private usersQueryRepository: UsersQueryRepository) {
  }

  async createUser(data: UserCreateModel) {

    const response = await this.usersQueryRepository.doesExistByLoginOrEmail(data.login, data.email)

    if (!response) {
      throw new BadRequestException();
    }

    const hash = await bcryptService.generateHash(data.password);

    try {
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

      const response = await user.save();
      const result = await this.findUserById(String(response._id))
      if (result) {
        return this._maping(result);
      }
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async findUserById(id: string) {
    try {
     return await this.UserModel.findOne({_id: new ObjectId(id)})
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }
  async deleteUser(id: string) {
    try {
      return await this.UserModel.findOneAndDelete({_id: new ObjectId(id)});
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async doesExistById(id: string) {
    const findedUser = await this.UserModel.findOne({_id: new ObjectId(id)});
    if (findedUser) {
      return this._maping(findedUser);
    }
    return null;
  }

  _maping(user: UserDocument): UserOutputModel {
    return {
      id: String(user._id),
      createdAt: user.createdAt,
      email: user.email,
      login: user.login,
    }
  }
}