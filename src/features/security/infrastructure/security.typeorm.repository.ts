import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceSessionEntity } from '../domain/device.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SecurityTypeOrmRepository {
  public constructor(
    @InjectRepository(DeviceSessionEntity)
    private readonly deviceSessionRepository: Repository<DeviceSessionEntity>,
  ) {}

  public async createDeviceSession(session: DeviceSessionEntity) {

    const {deviceId, iat, ip, exp, deviceName, id, userId} = session;

    const result = this.deviceSessionRepository.create({
      id,
      deviceId,
      deviceName,
      exp,
      iat,
      ip,
      userId
    })

    await this.deviceSessionRepository.save(result);


  }

}
