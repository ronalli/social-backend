import { Module, Provider } from '@nestjs/common';
import { UsersController } from './features/users/api/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {config} from 'dotenv';

import { User, UserSchema } from './features/users/domain/user.entity';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { UsersService } from './features/users/application/users.service';
import { UsersQueryRepository } from './features/users/infrastructure/users.query-repository';

import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogs.query-repository';
import { BlogsService } from './features/blogs/application/blogs.service';
import { BlogsController } from './features/blogs/api/blogs.controller';

import { PostsRepository } from './features/posts/infrastructure/posts.repository';
import { PostsQueryRepository } from './features/posts/infrastructure/posts.query-repository';
import { PostsService } from './features/posts/application/posts.service';
import { PostsController } from './features/posts/api/posts.controller';

import { CommentsService } from './features/comments/application/comments.service';
import { CommentsRepository } from './features/comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from './features/comments/infrastructure/comments.query-repository';
import { CommentsController } from './features/comments/api/comments.controller';
import { Blog, BlogSchema } from './features/blogs/domain/blog.entity';
import { Comment, CommentSchema } from './features/comments/domain/comment.entity';
import { Post, PostSchema } from './features/posts/domain/post.entity';
import { Like, LikeSchema } from './features/likes/domain/like.entity';

import { ConfigModule } from '@nestjs/config';
import { DeleteAllCollectionsController } from './features/test/api/delete.all.collections.controller';
import { DeleteService } from './features/test/application/delete.service';
import { QueryParamsService } from './common/utils/create.default.values';
import { MappingBlogsService } from './features/blogs/application/mappings/mapping.blogs';
import { MappingsCommentsService } from './features/comments/application/mappings/mapping.comments';
import { MappingsPostsService } from './features/posts/application/mappings/mapping.posts';
import { MappingsUsersService } from './features/users/application/mappings/mappings.users';
import { MapingErrorsService } from './common/utils/mappings.errors.service';
import { MappingsRequestHeadersService } from './common/utils/mappings.request.headers';
import { RecoveryCode, RecoveryCodeSchema } from './features/auth/domain/recoveryCode.entity';
import { NodemailerService } from './common/services/nodemailer.service';
import { AuthService } from './features/auth/application/auth.service';
import { AuthRepository } from './features/auth/infrastructure/auth.repository';
import { AuthQueryRepository } from './features/auth/infrastructure/auth-query.repository';
import { AuthController } from './features/auth/api/auth.controller';
import { appSettings } from './settings/app-settings';
import { LoginIsExistConstraint } from './common/decorators/validate/login-is-exist.decorator';
import { EmailIsExistConstraint } from './common/decorators/validate/email-is-exist.decorator';

config();

const usersProviders: Provider[
  ] = [
  UsersRepository,
  UsersService,
  UsersQueryRepository
]

const blogsProviders: Provider[] = [
  BlogsRepository,
  BlogsQueryRepository,
  BlogsService
]

const postsProviders: Provider[] = [
  PostsRepository,
  PostsQueryRepository,
  PostsService
]

const commentsProviders: Provider[] = [
  CommentsService,
  CommentsRepository,
  CommentsQueryRepository
]

const authProviders: Provider[] = [
  AuthService,
  AuthRepository,
  AuthQueryRepository
]

const mappingsProviders: Provider[] = [
  MappingBlogsService,
  MappingsCommentsService,
  MappingsPostsService
]

@Module({

  imports: [
    MongooseModule.forRoot(appSettings.api.MONGO_CONNECTION_URI),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}]),
    MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]),
    MongooseModule.forFeature([{name: Post.name, schema: PostSchema}]),
    MongooseModule.forFeature([{name: Like.name, schema: LikeSchema}]),
    MongooseModule.forFeature([{name: RecoveryCode.name, schema: RecoveryCodeSchema}]),

  ],
  controllers: [UsersController, BlogsController, CommentsController, PostsController, DeleteAllCollectionsController, AuthController],
  providers: [
    ...usersProviders,
    ...blogsProviders,
    ...postsProviders,
    ...commentsProviders,
    ...authProviders,
    ...mappingsProviders,
    DeleteService,
    QueryParamsService,
    MappingsUsersService,
    MapingErrorsService,
    MappingsRequestHeadersService,
    NodemailerService,
    LoginIsExistConstraint,
    EmailIsExistConstraint,
  ],
})
export class AppModule {}
