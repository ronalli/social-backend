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

@Module({
  imports: [CqrsModule, UsersModule, NodemailerService, MongooseModule.forFeature([{name: User.name, schema: UserSchema}]), MongooseModule.forFeature([{name: RecoveryCode.name, schema: RecoveryCodeSchema}])
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, NodemailerService, MappingsUsersService],
  exports: [AuthService]
})

export class AuthModule {}
