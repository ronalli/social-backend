import { Injectable } from '@nestjs/common';
import {InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OldRefreshTokenEntity } from '../domain/refreshToken.entity';

@Injectable()
export class AuthTypeOrmQueryRepository {
  constructor(
    @InjectRepository(OldRefreshTokenEntity)
    private readonly oldRefreshTokenRepository: Repository<OldRefreshTokenEntity>,
  ) {}

  async findOneOldRefreshToken(token: string) {

    return await this.oldRefreshTokenRepository.findOne({
      where: {refreshToken: token}
    });

    // const query = `
    //     SELECT id, "refreshToken"
    //     FROM public."oldRefreshTokens"
    //     WHERE "refreshToken" = $1
    //     `;
    //
    // const result = await this.dataSource.query(query, [token]);
    // return result[0];
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
