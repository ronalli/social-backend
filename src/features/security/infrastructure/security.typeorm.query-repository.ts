import {
  Injectable,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceSessionEntity } from '../domain/device.entity';

@Injectable()
export class SecurityTypeOrmQueryRepository {
  constructor(
    protected dataSource: DataSource,
    @InjectRepository(DeviceSessionEntity)
    private readonly deviceSessionRepository: Repository<DeviceSessionEntity>,
  ) {}

  async allSessionsUser(userId: string) {
    const currentDate = new Date().toISOString();

    return await this.deviceSessionRepository
      .createQueryBuilder('ds')
      .where('ds.userId = :userId', { userId })
      .andWhere('CAST(ds.exp AS TIMESTAMP) > :date', { date: currentDate })
      .getMany();
  }
}
