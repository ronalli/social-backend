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
import { AuthTypeOrmRepository } from './infrastructure/auth.typeorm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/domain/user.entity';
import { SecurityTypeOrmRepository } from '../security/infrastructure/security.typeorm.repository';
import { DeviceSessionEntity } from '../security/domain/device.entity';
import { RecoveryCodeEntity } from './domain/recoveryCode.entity';
import { OldRefreshTokenEntity } from './domain/refreshToken.entity';
import { ConfirmationEmailEntity } from '../users/domain/confirmation.email.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, DeviceSessionEntity, RecoveryCodeEntity, OldRefreshTokenEntity, ConfirmationEmailEntity]),
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
    SecurityTypeOrmRepository,
    MappingsRequestHeadersService,
    AuthTypeOrmRepository
  ],
  exports: [AuthService, AuthTypeOrmRepository],
})
export class AuthModule {}
