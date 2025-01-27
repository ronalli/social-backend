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
      sortDirection,
      sortBy,
      pageSize,
      pageNumber,
      searchLoginTerm,
      searchEmailTerm,
    } = queryParams;


    const loginPattern = searchLoginTerm ? `%${searchLoginTerm}%` : null;

    const emailPattern = searchEmailTerm ? `%${searchEmailTerm}%` : null;

    const totalCountQuery = `
            SELECT id, login, email, "createdAt" 
            FROM public."users" 
            WHERE
            ($1::text IS NULL AND $2::text IS NULL)
             OR 
             (login ILIKE COALESCE($1::text, '%') OR email ILIKE COALESCE($2::text, '%'))
    `;

    const totalCount = await this.dataSource.query(totalCountQuery, [loginPattern, emailPattern]);

    const pagesCount = Math.ceil(totalCount.length / pageSize);

    const query = `
            SELECT id, login, email, "createdAt" 
            FROM public."users" 
            WHERE
            ($1::text IS NULL AND $2::text IS NULL)
             OR 
             (login ILIKE COALESCE($1::text, '%') OR email ILIKE COALESCE($2::text, '%'))
            ORDER BY "${sortBy}" COLLATE "C" ${sortDirection}
            LIMIT ${pageSize} OFFSET ${pageSize * (pageNumber - 1)}
            `;

    const result = await this.dataSource.query(query, [loginPattern, emailPattern]);

    return {
      pagesCount: +pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount.length,
      items: result
    }
  }

  async doesExistById(id: number) {
    const query  = `SELECT * FROM public.users WHERE id = $1`
    const result = await this.dataSource.query(query, [id])

    // console.log(result);

    return result[0];
  }
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
    // const query = `SELECT * FROM public."users" WHERE login LIKE $1 OR email LIKE $2`

    const queryLogin = `SELECT * FROM public.users WHERE  login = $1`

    const queryEmail = `SELECT * FROM public.users WHERE email = $1`

    const resultLogin = await this.dataSource.query(queryLogin, [login])

    const resultEmail = await this.dataSource.query(queryEmail, [email])

    return {resultLogin, resultEmail}
  }

  async doesExistByEmail(email: string) {

    const query = `SELECT * FROM public."users" WHERE email = $1`;

    const response = await this.dataSource.query(query, [email]);

    return response.length != 0;

  }

  async doesExistConfirmationCode(userId: string): Promise<string> {
    const query = `SELECT * FROM public."confirmationEmailUsers" WHERE "userId" = $1`

    const result = await this.dataSource.query(query, [userId])

    return result[0].confirmationCode;
  }

  async doesExistConfirmationEmail(userId: string): Promise<string> {
    const query = `SELECT * FROM public."confirmationEmailUsers" WHERE "userId" = $1`

    const result = await this.dataSource.query(query, [userId])

    return result[0].isConfirmed;
  }


  //
  async findCodeConfirmation(codeConfirmation: string) {

    const query = `SELECT * FROM public."confirmationEmailUsers" WHERE "confirmationCode" = $1`;

    const response = await this.dataSource.query(query, [codeConfirmation])

    if(response.length === 0) {
      return false;
    }

    return response[0];
  }
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
