import { Injectable } from '@nestjs/common';
import { UserOutputModel } from '../api/models/output/user.output.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfirmationInfoEmail } from '../../../common/utils/createConfirmationInfoForEmail';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  // async create(
  //   id: string,
  //   login: string,
  //   email: string,
  //   hash: string,
  //   createdAt: Date,
  //   confirmation: ConfirmationInfoEmail,
  // ): Promise<string> {
  //   const values = [id, login, email, hash, createdAt];
  //
  //   const valuesEmail = [
  //     confirmation.userId,
  //     confirmation.isConfirmed,
  //     confirmation.expirationDate,
  //     confirmation.confirmationCode,
  //   ];
  //
  //   const query = `INSERT INTO public."users" (id, login, email, hash, "createdAt") VALUES($1, $2, $3, $4, $5) RETURNING *`;
  //
  //   const result = await this.dataSource.query(query, values);
  //
  //   const queryEmail = `INSERT INTO public."confirmationEmailUsers" ("userId", "isConfirmed", "expirationDate", "confirmationCode") VALUES($1, $2, $3, $4) RETURNING *`;
  //
  //   await this.dataSource.query(queryEmail, valuesEmail);
  //
  //   return result[0].id;
  // }

  // async findAllUser() {
  //   return await this.dataSource.query(`
  //     SELECT id, login, email, "createdAt"
  //     FROM public."users";`);
  // }

  // async findUserById(id: string): Promise<UserOutputModel> {
  //   const values = [id];
  //   const query = `SELECT id, login, email, "createdAt" FROM public."users" WHERE id = $1`;
  //
  //   const response = await this.dataSource.query(query, values);
  //
  //   return response[0];
  // }

  // async delete(id: string): Promise<boolean> {
  //   const query = `WITH deleted_table AS (
  //   DELETE
  //   FROM public."confirmationEmailUsers"
  //   WHERE "userId" = $1 )
  //   DELETE
  //   FROM public."users"
  //   WHERE "id" = $1
  //   ;`;
  //
  //   const result = await this.dataSource.query(query, [id]);
  //
  //   return result[1] > 0;
  // }
}
