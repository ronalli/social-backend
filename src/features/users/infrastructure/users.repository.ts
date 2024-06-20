import {ObjectId} from "mongodb";
import { Injectable } from '@nestjs/common';
import {UsersQueryRepository} from './users.query-repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../domain/user.entity';
import { ResultCode } from '../../../settings/http.status';
import { bcryptService } from '../../../common/auth.module';
import { IUserDBType, IUserInputModel, IUserViewModel } from '../api/models/all.types';


@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType , private usersQueryRepository: UsersQueryRepository) {
  }

  async createUser(data: IUserInputModel) {

    const response = await this.usersQueryRepository.doesExistByLoginOrEmail(data.login, data.email)

    if (response.status === ResultCode.BadRequest) {

      return {
        errorMessage: 'User founded',
        status: ResultCode.BadRequest,
        data: null
      }
    }

    const hash = await bcryptService.generateHash(data.password);

    const dataUser: IUserDBType = {
      email: data.email,
      login: data.login,
      hash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: null,
        expirationDate: null,
        isConfirmed: true
      }
    }
    try {
      const user = new this.UserModel(dataUser);
      const response = await user.save();
      const result = await this.findUserById(String(response._id))

      if (result.data) {
        const outViewModelUser = this._maping(result.data);
        return {
          status: ResultCode.Created,
          data: outViewModelUser,
        }
      }
      return {errorMessage: 'Error created user', status: ResultCode.NotFound, data: null}
    } catch (e) {
      return {errorMessage: 'Error DB', status: ResultCode.InternalServerError}
    }
  }

  async findUserById(id: string) {
    try {
      const foundUser = await this.UserModel.findOne({_id: new ObjectId(id)})
      if (foundUser) {
        return {
          status: ResultCode.Success,
          data: foundUser
        }
      }
      return {errorMessage: "Not found user", status: ResultCode.NotFound}

    } catch (e) {
      return {errorMessage: 'Errors BD', status: ResultCode.InternalServerError, data: null}
    }
  }

  async deleteUser(id: string) {
    try {
      const foundUser = await this.UserModel.findOne({_id: new ObjectId(id)});
      if (!foundUser) {
        return {
          errorMessage: 'Not found user',
          status: ResultCode.NotFound,
          data: null
        }
      }
      await this.UserModel.deleteOne({_id: new ObjectId(id)});
      return {
        status: ResultCode.NotContent,
        data: null
      }
    } catch (e) {
      return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
    }
  }

  async doesExistById(id: string) {
    const findedUser = await this.UserModel.findOne({_id: new ObjectId(id)});
    if (findedUser) {
      return this._maping(findedUser);
    }
    return null;
  }

  _maping(user: IUserDBType): IUserViewModel {
    return {
      id: String(user._id),
      createdAt: user.createdAt,
      email: user.email,
      login: user.login,
    }
  }
}