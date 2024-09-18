import { Module } from '@nestjs/common';
import { SecurityController } from './api/security.controller';
import { SecurityQueryRepository } from './infrastructure/security-query.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceEntity, DeviceEntitySchema } from './domain/device.entity';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: DeviceEntity.name, schema: DeviceEntitySchema },
    ]),
  ],
  controllers: [SecurityController],
  providers: [SecurityQueryRepository],
  exports: [],
})
export class SecurityModule {}
