import { Module } from '@nestjs/common';
import { DeleteService } from './application/delete.service';
import { DeleteAllCollectionsController } from './api/delete.all.collections.controller';

@Module({
  imports: [],
  controllers: [DeleteAllCollectionsController],
  providers: [DeleteService],
  exports: [DeleteService]
})

export class DeleteModule {}