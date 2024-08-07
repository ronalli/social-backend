import {ObjectId, SortDirection} from "mongodb";
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { ResultCode } from '../../../settings/http.status';
import { UserQueryDto } from '../api/models/user-query.dto';
import { UserOutputModel, UserOutputModelMapper } from '../api/models/output/user.output.model';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {
  }

  async getUsers(queryParams: UserQueryDto) {
    const query = this._createDefaultValues(queryParams);

    let search: {};
    if (query.searchLoginTerm && query.searchEmailTerm) {
      search = {
        $or: [
          {email: {$regex: `${query.searchEmailTerm}`, $options: "i"}},
          {login: {$regex: `${query.searchLoginTerm}`, $options: "i"}},
        ]
      }
    } else if (query.searchLoginTerm) {
      search = {login: {$regex: `${query.searchLoginTerm}`, $options: "i"}}
    } else if (query.searchEmailTerm) {
      search = {email: {$regex: `${query.searchEmailTerm}`, $options: "i"}}
    } else {
      search = {};
    }

    const filter = {
      ...search
    }
    try {
      const allUsers = await this.UserModel
        .find(filter)
        .sort({[query.sortBy]: query.sortDirection})
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(query.pageSize)

      const totalCount = await this.UserModel.countDocuments(filter);
      return {
        data: {
          pagesCount: Math.ceil(totalCount / query.pageSize),
          pageSize: query.pageSize,
          page: query.pageNumber,
          totalCount,
          items: this._maping(allUsers)
        }
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async doesExistById(id: string): Promise<UserOutputModel | null> {
    const findedUser = await this.UserModel.findOne({_id: new ObjectId(id)});
    if (findedUser) {
      return UserOutputModelMapper(findedUser);
    }
    return null;
  }

  async findUserById(id: string) {
    try {
      return await this.UserModel.findOne({_id: new ObjectId(id)})
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async doesExistByLoginOrEmail(login: string, email: string) {
    try {
      const user = await this.UserModel.findOne({
        $or: [{login: login}, {email: email}]
      });

      return !user;
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async findUserByCodeConfirmation(codeConfirmation: string) {
    try {
      const filter = {'emailConfirmation.confirmationCode': codeConfirmation}
      const user = await this.UserModel.findOne(filter);
      if (user) {
        return {data: user}
      }
      return false;

    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  _maping(users: UserDocument[]): UserOutputModel[] {
    return users.map(u => ({
      id: String(u._id),
      createdAt: u.createdAt,
      email: u.email,
      login: u.login,
    }))
  }

  _createDefaultValues(query: UserQueryDto) {
    return {
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
      sortBy: query.sortBy ? query.sortBy : "createdAt",
      sortDirection: query.sortDirection ? query.sortDirection as SortDirection : "desc",
      searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
      searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,
    }
  }
}