import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  decodeToken,
  IDecodeRefreshToken,
} from '../../../common/services/decode.token';
import { DeviceSessionEntity } from '../domain/device.entity';
import { SecurityRepository } from '../infrastructure/security.repository';
import { SessionHeadersInput } from '../api/models/input/session-headers.input';
import { SkipThrottle } from '@nestjs/throttler';
import { randomUUID } from 'node:crypto';
import { SecurityTypeOrmRepository } from '../infrastructure/security.typeorm.repository';

@Injectable()
// @SkipThrottle()
export class SecurityService {
  constructor(
    private readonly securityRepository: SecurityRepository,
    private readonly securityTypeOrmRepository: SecurityTypeOrmRepository,
  ) {}

  async createAuthSessions(token: string, data: SessionHeadersInput) {
    const payload = await decodeToken(token);

    if (payload) {
      const session: DeviceSessionEntity = {
        id: randomUUID(),
        ...data,
        ...payload,
      };

      await this.securityTypeOrmRepository.createDeviceSession(session);
    }
  }

  async deleteAuthSessionWithParam(
    data: IDecodeRefreshToken,
    deviceIdParam: string,
  ) {
    const { iat, userId, deviceId } = data;

    const res = await this.securityTypeOrmRepository.getDevice(deviceIdParam);

    if (!res) {
      throw new NotFoundException();
    }

    if (res.userId !== userId) {
      throw new ForbiddenException();
    }

    return await this.securityTypeOrmRepository.deleteDevice(
      res.iat,
      deviceIdParam,
    );
  }

  async deleteCurrentSession(data: IDecodeRefreshToken) {
    const { iat, userId, deviceId } = data;

    return await this.securityTypeOrmRepository.deleteDevice(iat, deviceId);
  }

  async deleteDevices(token: string) {
    const decode = await decodeToken(token);

    if (!decode) {
      throw new UnauthorizedException();
    }

    return await this.securityTypeOrmRepository.deleteDevicesButCurrent(decode);
  }

  async updateVersionSession(token: string) {
    const data = await decodeToken(token);

    if (!data) {
      throw new UnauthorizedException();
    }

    const response = await this.securityTypeOrmRepository.updateDevice(data);

    if (!response) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
