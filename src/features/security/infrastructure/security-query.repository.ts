import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SecurityQueryRepository {
  constructor(
    ) {
  }

  async allSessionsUser(id: string) {
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