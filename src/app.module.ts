import { Module, Provider } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { QueryParamsService } from './common/utils/create.default.values';
// import { MappingsUsersService } from './features/users/application/mappings/mappings.users';
// import { MapingErrorsService } from './common/utils/mappings.errors.service';
// import { MappingsRequestHeadersService } from './common/utils/mappings.request.headers';
// import { NodemailerService } from './common/services/nodemailer.service';
// import { appSettings } from './settings/app-settings';
// import { LoginIsExistConstraint } from './common/decorators/validate/login-is-exist.decorator';
// import { EmailIsExistConstraint } from './common/decorators/validate/email-is-exist.decorator';
// import { BlogIsExistConstraint } from './common/decorators/validate/blog-is-exist.decorator';
// import { IdMongoValidateConstraint } from './common/decorators/validate/id-mongo-validate';
// import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
// import { DeleteModule } from './features/test/delete.module';
// import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
// import { MappingBlogsService } from './features/bloggers-platform/blogs/application/mappings/mapping.blogs';
// import { MappingsCommentsService } from './features/bloggers-platform/comments/application/mappings/mapping.comments';
// import { MappingsPostsService } from './features/bloggers-platform/posts/application/mappings/mapping.posts';
// import { SecurityModule } from './features/security/security.module';
// import { APP_GUARD } from '@nestjs/core';
// import { ThrottlerGuard } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './features/users/domain/user.entity';
import { AuthModule } from './features/auth/auth.module';
import { DeleteModule } from './features/test/delete.module';
import { SecurityModule } from './features/security/security.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { MappingsPostsService } from './features/bloggers-platform/posts/application/mappings/mapping.posts';
import { MappingBlogsService } from './features/bloggers-platform/blogs/application/mappings/mapping.blogs';
import { MappingsCommentsService } from './features/bloggers-platform/comments/application/mappings/mapping.comments';

const mappingsProviders: Provider[] = [
  MappingBlogsService,
  MappingsCommentsService,
  MappingsPostsService,
];

@Module({
  imports: [
    // MongooseModule.forRoot(appSettings.api.MONGO_CONNECTION_URI),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'sa',
      entities: [User],
      database: 'SocialBD',
      synchronize: true,
      logging: true

    }),
    UsersModule,
    AuthModule,
    BloggersPlatformModule,
    SecurityModule,
    DeleteModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
    // ...mappingsProviders,
    // QueryParamsService,
    // MappingsUsersService,
    // MapingErrorsService,
    // MappingsRequestHeadersService,
    // NodemailerService,
    // LoginIsExistConstraint,
    // EmailIsExistConstraint,
    // BlogIsExistConstraint,
    // IdMongoValidateConstraint,
    // BlogIsExistConstraint,
  ],
})
export class AppModule {
  // constructor(private dataSource: DataSource) {
  // }
}
