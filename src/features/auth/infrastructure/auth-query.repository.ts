import { ResultCode } from '../../../settings/http.status';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async findOneOldRefreshToken(token: string) {
    const query = `
        SELECT id, "refreshToken" 
        FROM public."oldRefreshTokens"
        WHERE "refreshToken" = $1
        `;

    const result = await this.dataSource.query(query, [token]);
    return result[0];
  }

  async findByEmail(email: string) {
    // try {
    //   const user = await this.UserModel.findOne({email: email})
    //   if (user) return {
    //     status: ResultCode.Success,
    //     data: user
    //   };
    //   return {
    //     errorMessage: 'Error findByEmail',
    //     status: ResultCode.BadRequest
    //   }
    // } catch (e) {
    //   return {
    //     errorMessage: 'Error DB',
    //     status: ResultCode.InternalServerError
    //   }
    // }
  }
}
