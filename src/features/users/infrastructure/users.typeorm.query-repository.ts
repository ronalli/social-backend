import { Injectable } from '@nestjs/common';
import { UserQueryDto } from '../api/models/user-query.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { createOrderByClause } from '../../../common/utils/orderByClause';
import { UserEntity } from '../domain/user.entity';
import { ConfirmationEmailEntity } from '../domain/confirmation.email.entity';

@Injectable()
export class UsersTypeOrmQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ConfirmationEmailEntity)
    private readonly confirmationEmailRepository: Repository<ConfirmationEmailEntity>,
  ) {}

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


    const queryBuilder = this.userRepository.createQueryBuilder('u')
      .select([
        'u.id AS id',
        'u.login AS login',
        'u.email AS email',
        'u.createdAt AS "createdAt"'
      ])
      .where(searchLoginTerm ? 'u.login ILIKE :login' : '1=1', {
        login: `%${searchLoginTerm}%`
      })
      .andWhere(searchEmailTerm ? 'u.email ILIKE :email' : '1=1', {
        email: `%${searchEmailTerm}%`
      })
      .orderBy(`"${sortBy}"`, `${sortDirection}`)
      .limit(pageSize)
      .offset(pageSize * (pageNumber - 1))

    const result = await queryBuilder.getRawMany();

    const totalCount = await queryBuilder.clone().getCount();

    return {
      pagesCount: +Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: result,
    };
  }

  async doesExistById(id: string) {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  // async findUserById(id: string) {
  //   const query = `SELECT id, login FROM public.users WHERE id = $1;`;
  //
  //   const response = await this.dataSource.query(query, [id]);
  //
  //   return response[0];
  //
  // }

  async doesExistByLoginOrEmail(login: string, email: string) {
    const queryLogin = await this.userRepository.findOne({
      where: {
        login,
      },
    });

    const queryEmail = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    return [!!queryLogin, !!queryEmail];
  }

  async doesExistByEmail(email: string): Promise<boolean> {
    const queryEmail = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    return !!queryEmail;
  }

  async doesExistConfirmationCode(userId: string): Promise<string> {
    const query = await this.confirmationEmailRepository.findOne({
      where: {
        userId,
      },
    });

    return query.confirmationCode;
  }

  async doesExistConfirmationEmail(userId: string): Promise<boolean> {
    const query = await this.confirmationEmailRepository.findOne({
      where: {
        userId,
      },
    });

    return query.isConfirmed;
  }

  async findCodeConfirmation(confirmationCode: string) {
    const query = await this.confirmationEmailRepository.findOne({
      where: {
        confirmationCode,
      },
    });

    return !query.confirmationCode ? false : query;
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
