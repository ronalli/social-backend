import { Module } from '@nestjs/common';
import { UsersModule } from './features/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './features/users/domain/user.entity';
import { AuthModule } from './features/auth/auth.module';
import { DeleteModule } from './features/test/delete.module';
import { SecurityModule } from './features/security/security.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { configModule } from './dynamic-config-module';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfirmationEmailEntity } from './features/users/domain/confirmation.email.entity';
import { DeviceSessionEntity } from './features/security/domain/device.entity';
import { RecoveryCodeEntity } from './features/auth/domain/recoveryCode.entity';
import { OldRefreshTokenEntity } from './features/auth/domain/refreshToken.entity';
import { Blog } from './features/bloggers-platform/blogs/domain/blog.entity';
import { Post } from './features/bloggers-platform/posts/domain/post.entity';
import { PostLikeStatus } from './features/likes/domain/like.post.entity';

// TypeOrmModule.forRoot({
//   type: 'postgres',
//   host: '192.168.3.93',
//   port: 5432,
//   username: 'admin',
//   password: 'sa',
//   entities: [User],
//   database: 'SocialDB',
//   synchronize: true,
//   logging: true
//
// })

@Module({
  imports: [
    configModule,
    CqrsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'sa',
      entities: [Blog, UserEntity, Post, PostLikeStatus, ConfirmationEmailEntity, DeviceSessionEntity, RecoveryCodeEntity, OldRefreshTokenEntity],
      database: 'SocialBD_typeorm',
      synchronize: true,
      
      logging: true,
    }),
    UsersModule,
    AuthModule,
    BloggersPlatformModule,
    SecurityModule,
    DeleteModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
