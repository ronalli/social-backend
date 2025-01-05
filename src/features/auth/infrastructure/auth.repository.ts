import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { RegistrationModelUser } from '../api/models/input/registration.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfirmationInfoEmail } from '../../../common/utils/createConfirmationInfoForEmail';
import { UserOutputModel } from '../../users/api/models/output/user.output.model';
import { randomUUID } from 'node:crypto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    private readonly usersRepository: UsersRepository,
  ) {}

  async findByLoginOrEmail(loginOrEmail: string) {
    const query = `SELECT * FROM public."users" WHERE email = $1 OR login = $1`;
    return await this.dataSource.query(query, [loginOrEmail]);
  }

  async createUser(
    data: RegistrationModelUser,
    confirmation: ConfirmationInfoEmail,
  ): Promise<string> {
    const valuesUser = [
      data.id,
      data.login,
      data.email,
      data.hash,
      data.createdAt,
    ];

    const valuesEmail = [
      confirmation.userId,
      confirmation.isConfirmed,
      confirmation.expirationDate,
      confirmation.confirmationCode,
    ];

    const query = `INSERT INTO public."users" (id, login, email, hash, "createdAt") VALUES($1, $2, $3, $4, $5) RETURNING *;`;

    const response = await this.dataSource.query(query, valuesUser);

    const queryEmail = `INSERT INTO public."confirmationEmailUsers" ("userId", "isConfirmed", "expirationDate", "confirmationCode") VALUES($1, $2, $3, $4) RETURNING *`;

    await this.dataSource.query(queryEmail, valuesEmail);

    return response[0].id;
  }

  async findByEmail(email: string): Promise<UserOutputModel> {
    const query = `SELECT * from public."users" WHERE email = $1`;

    const response = await this.dataSource.query(query, [email]);

    return response[0];
  }

  async updateConfirmationInfo(
    id: string,
    expirationDate: Date,
    confirmationCode: string,
  ) {
    const query = `UPDATE public."confirmationEmailUsers" SET "expirationDate" = $1, "confirmationCode" = $2 WHERE "userId" = $3`;

    return await this.dataSource.query(query, [
      expirationDate,
      confirmationCode,
      id,
    ]);
  }

  async addOverdueRefreshToken(token: string) {

    const id = randomUUID();

    const query = `
    INSERT INTO public."oldRefreshTokens" (id, "refreshToken") VALUES ($1, $2) RETURNING *`;

    const result = await this.dataSource.query(query, [id, token]);

    return result[0];

  }

}
