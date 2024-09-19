import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { IDecodeRefreshToken } from '../../../common/services/decode.token';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceEntity, DeviceEntityModel } from '../domain/device.entity';

@Injectable()
export class SecurityRepository {

  constructor(@InjectModel(DeviceEntity.name) private DeviceModel: DeviceEntityModel) {
  }

  async deleteDevice(iat: string, deviceId: string) {
    try {
      const success = await this.DeviceModel.deleteOne({iat: iat, deviceId: deviceId})
      return true;

    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async deleteDevicesButCurrent(data: IDecodeRefreshToken) {
    const {iat, userId, deviceId} = data;

    try {
      const currentDevice = await this.DeviceModel.findOne({iat: iat})

      await this.DeviceModel.deleteMany({userId: userId, _id: {$ne: currentDevice?._id}})

      return true;

    } catch (e) {
     throw new InternalServerErrorException(e)
    }
  }

  async getDevice(deviceId: string) {
    try {
      return await this.DeviceModel.findOne({deviceId: deviceId})
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async updateDevice(data: IDecodeRefreshToken) {

    const {iat, deviceId, userId, exp} = data;

    const currentDevice = await this.DeviceModel.findOne({$and: [{deviceId: deviceId}, {userId: userId}]})

    if (!currentDevice) {
      throw new UnauthorizedException();
    }

    currentDevice.iat = iat;
    currentDevice.exp = exp;
    await currentDevice.save();

    return currentDevice;
  }

}