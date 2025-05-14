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

  async deleteDevice(iat: string, deviceId: string): Promise<boolean> {
    const query = `DELETE FROM public."deviceSessions" WHERE iat = $1 AND "deviceId" = $2;`;

    const result = await this.dataSource.query(query, [iat, deviceId]);

    return result[1] > 0;
  }

  async deleteDevicesButCurrent(data: IDecodeRefreshToken): Promise<boolean> {
    const { userId, deviceId } = data;

    const query = `DELETE FROM public."deviceSessions" WHERE ("userId" = $1 AND "deviceId" != $2);`;

    const result = await this.dataSource.query(query, [userId, deviceId]);

    return result[1] > 0;
  }

  async getDevice(deviceId: string) {
    const query = `SELECT * FROM public."deviceSessions" WHERE "deviceId" = $1;`;

    const result = await this.dataSource.query(query, [deviceId]);

    return result[0];
  }

  async updateDevice(data: IDecodeRefreshToken): Promise<boolean> {
    const { iat, deviceId, userId, exp } = data;

    const query = `UPDATE public."deviceSessions" SET iat = $1, exp = $2 WHERE "deviceId" = $3 AND "userId" = $4;`;

    const response = await this.dataSource.query(query, [
      iat,
      exp,
      deviceId,
      userId,
    ]);

    if (response[1] === 0) {
      throw new UnauthorizedException();
    }

    return response[1] > 0;
  }
}
