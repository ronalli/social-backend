import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { AuthRepository } from './infrastructure/auth.repository';import { UsersModule } from '../users/users.module';
import { NodemailerService } from '../../common/services/nodemailer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/domain/user.entity';
import { RecoveryCode, RecoveryCodeSchema } from './domain/recoveryCode.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { MappingsUsersService } from '../users/application/mappings/mappings.users';
import { OldRefreshToken, OldRefreshTokenSchema } from './domain/refreshToken.entity';
import { SecurityModule } from '../security/security.module';
import { MappingsRequestHeadersService } from '../../common/utils/mappings.request.headers';

@Module({
  imports: [
    CqrsModule,
    UsersModule,
    NodemailerService,
    SecurityModule,
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]), MongooseModule.forFeature([{name: RecoveryCode.name, schema: RecoveryCodeSchema}]),
    MongooseModule.forFeature([{ name: OldRefreshToken.name, schema: OldRefreshTokenSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, NodemailerService, MappingsUsersService, MappingsRequestHeadersService],
  exports: [AuthService]
})

export class AuthModule {}
