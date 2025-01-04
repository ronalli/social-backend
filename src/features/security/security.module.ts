import { Module } from '@nestjs/common';
import { SecurityController } from './api/security.controller';
import { SecurityQueryRepository } from './infrastructure/security-query.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { SecurityService } from './application/security.service';
import { SecurityRepository } from './infrastructure/security.repository';

@Module({
  imports: [
  ],
  controllers: [SecurityController],
  providers: [SecurityService, SecurityQueryRepository, SecurityRepository],
  exports: [SecurityService],
})
export class SecurityModule {}
