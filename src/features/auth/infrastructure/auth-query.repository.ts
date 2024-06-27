import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { User, UserModelType } from '../../users/domain/user.entity';
import { ResultCode } from '../../../settings/http.status';


@Injectable()
export class AuthQueryRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {
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