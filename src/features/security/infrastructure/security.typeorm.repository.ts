import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceSessionEntity } from '../domain/device.entity';
import { Repository } from 'typeorm';
import { IDecodeRefreshToken } from '../../../common/services/decode.token';

@Injectable()
export class SecurityTypeOrmRepository {
  public constructor(
    @InjectRepository(DeviceSessionEntity)
    private readonly deviceSessionRepository: Repository<DeviceSessionEntity>,
  ) {}

  public async createDeviceSession(session: DeviceSessionEntity) {
    const { deviceId, iat, ip, exp, deviceName, id, userId } = session;

    const result = this.deviceSessionRepository.create({
      id,
      deviceId,
      deviceName,
      exp,
      iat,
      ip,
      userId,
    });

    await this.deviceSessionRepository.save(result);
  }

  public async updateDevice(data: IDecodeRefreshToken): Promise<boolean> {
    const { iat, deviceId, userId, exp } = data;

    const updateSession = await this.deviceSessionRepository.update(
      {
        deviceId: deviceId,
        userId: userId,
      },
      {
        iat: iat,
        exp: exp,
      },
    );

    if (updateSession.affected === 1) {
      return true;
    }

    throw new UnauthorizedException();
  }

  async deleteDevice(iat: Date, deviceId: string): Promise<boolean> {
    const result = await this.deviceSessionRepository.delete({
      iat: iat,
      deviceId: deviceId,
    });

    return result.affected === 1;
  }

  public async deleteDevicesButCurrent(
    data: IDecodeRefreshToken,
  ): Promise<boolean> {
    const { userId, deviceId } = data;

    const result = await this.deviceSessionRepository
      .createQueryBuilder()
      .delete()
      .from(DeviceSessionEntity)
      .where('userId = :userId AND deviceId != :deviceId', {
        userId,
        deviceId,
      })
      .execute();

    return result.affected > 0;
  }

  async getDevice(deviceId: string) {
    return await this.deviceSessionRepository.findOne({
      where: {
        deviceId: deviceId,
      },
    });
  }
}
