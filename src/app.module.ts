import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {config} from 'dotenv';
import { QueryParamsService } from './common/utils/create.default.values';
import { MappingBlogsService } from './features/blogs/application/mappings/mapping.blogs';
import { MappingsCommentsService } from './features/comments/application/mappings/mapping.comments';
import { MappingsPostsService } from './features/posts/application/mappings/mapping.posts';
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
import { BlogsModule } from './features/blogs/blogs.module';
import { CommentsModule } from './features/comments/comments.module';
import { PostsModule } from './features/posts/posts.module';
import { UsersModule } from './features/users/users.module';
import { DeleteModule } from './features/test/delete.module';

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
    BlogsModule,
    CommentsModule,
    PostsModule,
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
