import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
// import { AuthRepository } from './infrastructure/auth.repository';
import { UsersModule } from '../users/users.module';
import { NodemailerService } from '../../common/services/nodemailer.service';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthRepository } from './infrastructure/auth.repository';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { UsersQueryRepository } from '../users/infrastructure/users.query-repository';
import { MappingsUsersService } from '../users/application/mappings/mappings.users';

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
  ],
  controllers: [AuthController],
  providers: [
    ThrottlerGuard,
    AuthService,
    AuthRepository,
    MappingsUsersService,
    NodemailerService
  ],
  exports: [AuthService],
})
export class AuthModule {}
