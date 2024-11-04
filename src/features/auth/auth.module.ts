// import { Module } from '@nestjs/common';
// import { AuthController } from './api/auth.controller';
// import { AuthService } from './application/auth.service';
// import { AuthRepository } from './infrastructure/auth.repository';
// import { UsersModule } from '../users/users.module';
// import { NodemailerService } from '../../common/services/nodemailer.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from '../users/domain/user.entity';
// import { RecoveryCode, RecoveryCodeSchema } from './domain/recoveryCode.entity';
// import { CqrsModule } from '@nestjs/cqrs';
// import { MappingsUsersService } from '../users/application/mappings/mappings.users';
// import {
//   OldRefreshToken,
//   OldRefreshTokenSchema,
// } from './domain/refreshToken.entity';
// import { SecurityModule } from '../security/security.module';
// import { MappingsRequestHeadersService } from '../../common/utils/mappings.request.headers';
// import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
// import { APP_GUARD } from '@nestjs/core';
//
// @Module({
//   imports: [
//     ThrottlerModule.forRoot([
//       {
//         ttl: 10000,
//         limit: 5,
//       },
//     ]),
//     CqrsModule,
//     UsersModule,
//     NodemailerService,
//     SecurityModule,
//     MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
//     MongooseModule.forFeature([
//       { name: RecoveryCode.name, schema: RecoveryCodeSchema },
//     ]),
//     MongooseModule.forFeature([
//       { name: OldRefreshToken.name, schema: OldRefreshTokenSchema },
//     ]),
//   ],
//   controllers: [AuthController],
//   providers: [
//     ThrottlerGuard,
//     AuthService,
//     AuthRepository,
//     NodemailerService,
//     MappingsUsersService,
//     MappingsRequestHeadersService,
//   ],
//   exports: [AuthService],
// })
// export class AuthModule {}
