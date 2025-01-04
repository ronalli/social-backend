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

    const query = `DELETE FROM public."deviceSessions" WHERE iat = $1 AND "deviceId" = $2;`

    const result = await this.dataSource.query(query, [iat, deviceId]);

    return result[1] > 0
  }

  async deleteDevicesButCurrent(data: IDecodeRefreshToken) {
    const {iat, userId} = data;

    const query = `DELETE FROM public."deviceSessions" WHERE ("userId" = $1 AND NOT iat = $2);`


    const result = await this.dataSource.query(query, [userId, iat])

    return result[1] > 0;

  }

  async getDevice(deviceId: string) {

    const query = `SELECT * FROM public."deviceSessions" WHERE "deviceId" = $1;`;

    const result = await this.dataSource.query(query, [deviceId])

    return result[0];

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
