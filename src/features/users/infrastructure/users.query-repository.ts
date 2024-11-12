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

    const loginPattern = searchLoginTerm ? `${searchLoginTerm}%` : null;

    const emailPattern = searchEmailTerm ? `${searchEmailTerm}%` : null;

    const query = `
            SELECT id, login, email, "createdAt" 
            FROM public."users" 
            WHERE 
             (  $1::text IS NULL AND $2::text IS NULL) 
                OR (login LIKE COALESCE($1::text, '%'))
                AND (email LIKE COALESCE($2::text, '%'))
            ORDER BY "${sortBy}" ${sortDirection} 
            LIMIT ${pageSize} OFFSET ${pageSize * (pageNumber - 1)}
            `;

    const result = await this.dataSource.query(query, [loginPattern, emailPattern]);

    // console.log(result)

    return {
      pagesCount: pagesCount,
      pageSize: +pageSize,
      page: pageNumber,
      totalCount: totalCount.length,
      items: result
    }
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
  async doesExistByLoginOrEmail(login: string, email: string) {
    const query = `SELECT * FROM public."users" WHERE login LIKE $1 OR email LIKE $2`

    const result = await this.dataSource.query(query, [login, email])

    return result.length === 0

  }
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
