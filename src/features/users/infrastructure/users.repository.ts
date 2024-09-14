import {ObjectId} from "mongodb";
import { Injectable, InternalServerErrorException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { UserOutputModel, UserOutputModelMapper } from '../api/models/output/user.output.model';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {
  }

  async createUser(user: UserDocument) {
    const insertResult = await this.UserModel.insertMany([user]);

    return insertResult[0].id
  }

  async findUserById(id: string) {
    try {
     return await this.UserModel.findOne({_id: new ObjectId(id)})
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }
  async delete(id: string): Promise<boolean> {
    try {

      const deletingResult = await this.UserModel.deleteOne({_id: new ObjectId(id)});

      return !!deletingResult.deletedCount
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async doesExistById(id: string): Promise<UserOutputModel | null> {
    const findedUser = await this.UserModel.findOne({_id: new ObjectId(id)});
    if (findedUser) {
      return UserOutputModelMapper(findedUser);
    }
    return null;
  }

  async loginIsExist(login: string): Promise<boolean> {
    return !!(await this.UserModel.countDocuments({login}))
  }

  async emailIsExist(email: string): Promise<boolean> {
    return !!(await this.UserModel.countDocuments({email}))
  }


}