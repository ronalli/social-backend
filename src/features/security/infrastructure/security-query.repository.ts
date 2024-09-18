import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { DeviceEntity, DeviceEntityModel } from '../domain/device.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SecurityQueryRepository {
  constructor(
    @InjectModel(DeviceEntity.name) private DeviceModel: DeviceEntityModel
  ) {
  }

  async allSessionsUser(id: string) {
    try {

      const result = await this.DeviceModel.find({ userId: id, exp: { $gt: new Date().toISOString() } }).lean();

      if (result.length === 0) {
        return null;
      }

      return result;

    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

}