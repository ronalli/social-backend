import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserQueryDto } from '../api/models/user-query.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getAllUsers(queryParams: UserQueryDto) {
    // console.log(queryParams);

    const {
      searchNameTerm,
      sortDirection,
      sortBy,
      pageSize,
      pageNumber,
      searchLoginTerm,
      searchEmailTerm,
    } = queryParams;

    const totalCount = await this.dataSource.query(
      `SELECT * FROM public."users"`,
    );

    const pagesCount = Math.ceil(totalCount.length / pageSize);

    const query = `SELECT id, login, email, "createdAt" FROM public."users" ORDER BY "${sortBy}" ${sortDirection} LIMIT ${pageSize} OFFSET ${pageSize * (pageNumber - 1)}`;

    const result = await this.dataSource.query(query);

    console.log(result, result.length);

    // const query = this._createDefaultValues(queryParams);

    // return {
    //   data: {
    //     pagesCount: Math.ceil(totalCount / query.pageSize),
    //     pageSize: query.pageSize,
    //     page: query.pageNumber,
    //     totalCount,
    //     items: this._maping(allUsers)
    //   }
    // }
  }

  // async doesExistById(id: string): Promise<UserOutputModel | null> {
  //   const findedUser = await this.UserModel.findOne({_id: new ObjectId(id)});
  //   if (findedUser) {
  //     return UserOutputModelMapper(findedUser);
  //   }
  //   return null;
  // }
  //
  // async findUserById(id: string) {
  //   try {
  //     return await this.UserModel.findOne({_id: new ObjectId(id)})
  //   } catch (e) {
  //     throw new InternalServerErrorException(e)
  //   }
  // }
  //
  // async doesExistByLoginOrEmail(login: string, email: string) {
  //   try {
  //     const user = await this.UserModel.findOne({
  //       $or: [{login: login}, {email: email}]
  //     });
  //
  //     return !user;
  //   } catch (e) {
  //     throw new InternalServerErrorException(e)
  //   }
  // }
  //
  // async findUserByCodeConfirmation(codeConfirmation: string) {
  //   try {
  //     const filter = {'emailConfirmation.confirmationCode': codeConfirmation}
  //     const user = await this.UserModel.findOne(filter);
  //     if (user) {
  //       return {data: user}
  //     }
  //     return false;
  //
  //   } catch (e) {
  //     throw new InternalServerErrorException(e)
  //   }
  // }
  //
  // _maping(users: UserDocument[]): UserOutputModel[] {
  //   return users.map(u => ({
  //     id: String(u._id),
  //     createdAt: u.createdAt,
  //     email: u.email,
  //     login: u.login,
  //   }))
  // }

  // _createDefaultValues(query: UserQueryDto) {
  //   return {
  //     pageNumber: query.pageNumber ? +query.pageNumber : 1,
  //     pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
  //     sortBy: query.sortBy ? query.sortBy : "createdAt",
  //     sortDirection: query.sortDirection ? query.sortDirection as SortDirection : "desc",
  //     searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
  //     searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,
  //   }
  // }
}
