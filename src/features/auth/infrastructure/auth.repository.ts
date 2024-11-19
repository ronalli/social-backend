import { Injectable} from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { UserCreateModel } from '../../users/api/models/input/create-user.input.model';
import { RegistrationModelUser } from '../api/models/input/registration.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    private readonly usersRepository: UsersRepository) {
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    const query = `SELECT * FROM public."users" WHERE email = $1 OR login = $1`;
    return await this.dataSource.query(query, [loginOrEmail]);
  }

  async createUser(data: RegistrationModelUser): Promise<number> {
    const {login, email, hash, createdAt} = data;
    const values = [login, email, hash, createdAt];

    const query = `INSERT INTO public."users" (login, email, hash, "createdAt") VALUES($1, $2, $3, $4) RETURNING *;`

    const response = await this.dataSource.query(query, values)

    return response[0].id;
  }

  async findByEmail(email: string) {
    return null;
  }
}