import { Module, Provider } from '@nestjs/common';
import { UsersController } from './features/users/api/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {config} from 'dotenv';
import { User, UserSchema } from './features/users/domain/user.entity';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { UsersService } from './features/users/application/users.service';
import { UsersQueryRepository } from './features/users/infrastructure/users.query-repository';
import * as process from 'node:process';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogs.query-repository';
import { BlogsService } from './features/blogs/application/blogs.service';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { PostsRepository } from './features/posts/infrastructure/posts.repository';
import { PostsQueryRepository } from './features/posts/infrastructure/posts.query-repository';
import { PostsService } from './features/posts/application/posts.service';
import { CommentsService } from './features/comments/application/comments.service';
import { CommentsRepository } from './features/comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from './features/comments/infrastructure/comments.query-repository';
import { CommentsController } from './features/comments/api/comments.controller';
import { PostsController } from './features/posts/api/posts.controller';

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

@Module({

  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
  ],
  controllers: [UsersController, BlogsController, CommentsController, PostsController],
  providers: [
    ...usersProviders,
    ...blogsProviders,
    ...postsProviders,
    ...commentsProviders
  ],
})
export class AppModule {}
