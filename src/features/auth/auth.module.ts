import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { UsersModule } from '../users/users.module';
import { NodemailerService } from '../../common/services/nodemailer.service';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthRepository } from './infrastructure/auth.repository';
import { MappingsUsersService } from '../users/application/mappings/mappings.users';
import { AuthQueryRepository } from './infrastructure/auth-query.repository';
import { SecurityService } from '../security/application/security.service';
import { SecurityModule } from '../security/security.module';
import { MappingsRequestHeadersService } from '../../common/utils/mappings.request.headers';
import { SecurityQueryRepository } from '../security/infrastructure/security-query.repository';
import { SecurityRepository } from '../security/infrastructure/security.repository';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
    CqrsModule,
    UsersModule,
    SecurityModule,
  ],
  controllers: [AuthController],
  providers: [
    ThrottlerGuard,
    AuthService,
    AuthRepository,
    AuthQueryRepository,
    MappingsUsersService,
    NodemailerService,
    SecurityService,
    SecurityQueryRepository,
    SecurityRepository,
    MappingsRequestHeadersService
  ],
  exports: [AuthService],
})
export class AuthModule {}
