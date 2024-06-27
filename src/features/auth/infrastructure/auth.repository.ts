import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../users/domain/user.entity';
import { ResultCode } from '../../../settings/http.status';
import { UserCreateModel } from '../../users/api/models/input/create-user.input.model';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType, private readonly usersRepository: UsersRepository) {
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    try {
      const filter = {
        $or: [{email: loginOrEmail}, {login: loginOrEmail}],
      }

      const findUser = await this.UserModel.findOne(filter)

      if (findUser) return {status: ResultCode.Success, data: findUser};
      return {errorMessage: 'Not found login/email', status: ResultCode.Unauthorized, data: null}

    } catch (e) {
      return {errorMessage: 'Error DB', status: ResultCode.BadRequest, data: null};
    }
  }

  async createUser(data: UserCreateModel) {
    try {
      const user = new this.UserModel(data);
      const response = await user.save();

      const result = await this.usersRepository.findUserById(String(response._id))

      if (result.data) {

        return {
          status: ResultCode.Created,
          data: result.data,
        }
      }
      return {errorMessage: 'Error created user', status: ResultCode.NotFound, data: null}
    } catch (e) {
      return {errorMessage: 'Error DB', status: ResultCode.InternalServerError}
    }
  }

  async findByEmail(email: string){
    try {
      const user = await this.UserModel.findOne({email: email})
      if (user) return {
        status: ResultCode.Success,
        data: user
      };
      return {
        errorMessage: 'Error findByEmail',
        status: ResultCode.BadRequest
      }
    } catch (e) {
      return {
        errorMessage: 'Error DB',
        status: ResultCode.InternalServerError
      }
    }
  }

}