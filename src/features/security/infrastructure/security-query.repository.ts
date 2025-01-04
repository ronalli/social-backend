import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SecurityQueryRepository {
  constructor(protected dataSource: DataSource
    ) {
  }

  async allSessionsUser(userId: string) {

    const query = `
      SELECT * FROM public."deviceSessions" 
      WHERE "userId" = $1;
    `
    return await this.dataSource.query(query, [userId])


  //   try {
  //
  //     const result = await this.DeviceModel.find({ userId: id, exp: { $gt: new Date().toISOString() } }).lean();
  //
  //     if (result.length === 0) {
  //       return null;
  //     }
  //
  //     return result;
  //
  //   } catch (e) {
  //     throw new InternalServerErrorException();
  //   }
  }

}