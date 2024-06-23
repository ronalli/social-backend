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

const mappingsProviders: Provider[] = [
  MappingBlogsService,
  MappingsCommentsService,
  MappingsPostsService
]

@Module({

  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL + `${process.env.DB_NAME}`),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}]),
    MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]),
    MongooseModule.forFeature([{name: Post.name, schema: PostSchema}]),
    MongooseModule.forFeature([{name: Like.name, schema: LikeSchema}]),

  ],
  controllers: [UsersController, BlogsController, CommentsController, PostsController, DeleteAllCollectionsController],
  providers: [
    ...usersProviders,
    ...blogsProviders,
    ...postsProviders,
    ...commentsProviders,
    ...mappingsProviders,
    DeleteService,
    QueryParamsService,

  ],
})
export class AppModule {}
