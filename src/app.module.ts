import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {config} from 'dotenv';
import { QueryParamsService } from './common/utils/create.default.values';
import { MappingsUsersService } from './features/users/application/mappings/mappings.users';
import { MapingErrorsService } from './common/utils/mappings.errors.service';
import { MappingsRequestHeadersService } from './common/utils/mappings.request.headers';
import { NodemailerService } from './common/services/nodemailer.service';
import { appSettings } from './settings/app-settings';
import { LoginIsExistConstraint } from './common/decorators/validate/login-is-exist.decorator';
import { EmailIsExistConstraint } from './common/decorators/validate/email-is-exist.decorator';
import { BlogIsExistConstraint } from './common/decorators/validate/blog-is-exist.decorator';
import { IdMongoValidateConstraint } from './common/decorators/validate/id-mongo-validate';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { DeleteModule } from './features/test/delete.module';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { MappingBlogsService } from './features/bloggers-platform/blogs/application/mappings/mapping.blogs';
import { MappingsCommentsService } from './features/bloggers-platform/comments/application/mappings/mapping.comments';
import { MappingsPostsService } from './features/bloggers-platform/posts/application/mappings/mapping.posts';

config();


const mappingsProviders: Provider[] = [
  MappingBlogsService,
  MappingsCommentsService,
  MappingsPostsService
]


@Module({

  imports: [
    MongooseModule.forRoot(appSettings.api.MONGO_CONNECTION_URI),
    UsersModule,
    AuthModule,
    BloggersPlatformModule,
    DeleteModule,
  ],
  controllers: [],
  providers: [
    ...mappingsProviders,
    QueryParamsService,
    MappingsUsersService,
    MapingErrorsService,
    MappingsRequestHeadersService,
    NodemailerService,
    LoginIsExistConstraint,
    EmailIsExistConstraint,
    BlogIsExistConstraint,
    IdMongoValidateConstraint,
    BlogIsExistConstraint,
  ],
})
export class AppModule {}
