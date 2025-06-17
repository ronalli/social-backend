import { Module } from '@nestjs/common';
import { SecurityController } from './api/security.controller';
import { SecurityQueryRepository } from './infrastructure/security-query.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { SecurityService } from './application/security.service';
import { SecurityRepository } from './infrastructure/security.repository';
import { SecurityTypeOrmRepository } from './infrastructure/security.typeorm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceSessionEntity } from './domain/device.entity';
import { SecurityTypeOrmQueryRepository } from './infrastructure/security.typeorm.query-repository';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceSessionEntity])],
  controllers: [SecurityController],
  providers: [SecurityService, SecurityQueryRepository, SecurityRepository, SecurityTypeOrmRepository, SecurityTypeOrmQueryRepository],
  exports: [SecurityService],
})
export class SecurityModule {}
