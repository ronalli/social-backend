import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { IDecodeRefreshToken } from '../../../common/services/decode.token';
import { DeviceSessionEntity } from '../domain/device.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class SecurityRepository {
  constructor(protected dataSource: DataSource) {}

  async createDeviceSession(session: DeviceSessionEntity) {
    const { deviceId, deviceName, iat, userId, exp, ip, id } = session;

    const query = `
      INSERT INTO public."deviceSessions" (id, "deviceId", exp, iat, ip, "userId", "deviceName") VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const result = await this.dataSource.query(query, [
      id,
      deviceId,
      exp,
      iat,
      ip,
      userId,
      deviceName,
    ]);

    return result[0];
  }

  async deleteDevice(iat: string, deviceId: string) {
    // try {
    //   const success = await this.DeviceModel.deleteOne({iat: iat, deviceId: deviceId})
    //   return true;
    //
    // } catch (e) {
    //   throw new InternalServerErrorException(e)
    // }
  }

  async deleteDevicesButCurrent(data: IDecodeRefreshToken) {
    // const {iat, userId, deviceId} = data;
    //
    // try {
    //   const currentDevice = await this.DeviceModel.findOne({iat: iat})
    //
    //   await this.DeviceModel.deleteMany({userId: userId, _id: {$ne: currentDevice?._id}})
    //
    //   return true;
    //
    // } catch (e) {
    //  throw new InternalServerErrorException(e)
    // }
  }

  async getDevice(deviceId: string) {
    // try {
    //   return await this.DeviceModel.findOne({deviceId: deviceId})
    // } catch (e) {
    //   throw new InternalServerErrorException(e)
    // }
  }

  async updateDevice(data: IDecodeRefreshToken) {
    //
    // const {iat, deviceId, userId, exp} = data;
    //
    // const currentDevice = await this.DeviceModel.findOne({$and: [{deviceId: deviceId}, {userId: userId}]})
    //
    // if (!currentDevice) {
    //   throw new UnauthorizedException();
    // }
    //
    // currentDevice.iat = iat;
    // currentDevice.exp = exp;
    // await currentDevice.save();
    //
    // return currentDevice;
  }
}
