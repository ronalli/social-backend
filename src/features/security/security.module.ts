import { Module } from '@nestjs/common';
import { SecurityController } from './api/security.controller';
import { SecurityQueryRepository } from './infrastructure/security-query.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceEntity, DeviceEntitySchema } from './domain/device.entity';
import { SecurityService } from './application/security.service';
import { SecurityRepository } from './infrastructure/security.repository';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: DeviceEntity.name, schema: DeviceEntitySchema },
    ]),
  ],
  controllers: [SecurityController],
  providers: [SecurityService, SecurityQueryRepository, SecurityRepository],
  exports: [SecurityService],
})
export class SecurityModule {}
