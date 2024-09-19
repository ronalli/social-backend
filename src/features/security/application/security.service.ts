import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { decodeToken, IDecodeRefreshToken } from '../../../common/services/decode.token';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceEntity, DeviceEntityModel } from '../domain/device.entity';
import { SecurityRepository } from '../infrastructure/security.repository';
import { SessionHeadersInput } from '../api/models/input/session-headers.input';
import { Types } from 'mongoose';

@Injectable()
export class SecurityService {
  constructor(
    @InjectModel(DeviceEntity.name) private DeviceModel: DeviceEntityModel,
    private readonly securityRepository: SecurityRepository,
  ) {
  }

  async createAuthSessions(token: string, data: SessionHeadersInput) {

    const payload = await decodeToken(token)

    if (payload) {
      const session: DeviceEntity = {
        _id: new Types.ObjectId(),
        ...data,
        ...payload
      };
      const device = new this.DeviceModel(session)
      await device.save()
    }
  }

  async deleteAuthSessionWithParam(data: IDecodeRefreshToken, deviceIdParam: string) {
    const {iat, userId, deviceId} = data;

    const res = await this.securityRepository.getDevice(deviceIdParam);

    if (!res) {
      throw new NotFoundException();
    }
    if (res.userId !== userId) {
      throw new ForbiddenException();
    }
    return await this.securityRepository.deleteDevice(res.iat, deviceIdParam)
  }

  async deleteCurrentSession(data: IDecodeRefreshToken) {
    const {iat, userId, deviceId} = data;

    return await this.securityRepository.deleteDevice(iat, deviceId)
  }

  async deleteDevices(token: string) {

    const decode = await decodeToken(token);

    if (!decode) {
      throw new UnauthorizedException();
    }

    return await this.securityRepository.deleteDevicesButCurrent(decode)
  }

  async updateVersionSession(token: string) {
    const data = await decodeToken(token)

    if (!data) {
      throw new UnauthorizedException();
    }

    const response = await this.securityRepository.updateDevice(data);

    if (!response) {
      throw new UnauthorizedException();
    }

    return true;
  }

}