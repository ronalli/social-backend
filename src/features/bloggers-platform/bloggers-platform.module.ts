import { BlogsController } from './blogs/api/blogs.controller';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { BlogsQueryRepository } from './blogs/infrastructure/blogs.query-repository';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { MappingsPostsService } from './posts/application/mappings/mapping.posts';
import { MappingBlogsService } from './blogs/application/mappings/mapping.blogs';
import { QueryParamsService } from '../../common/utils/create.default.values';
import { PostsService } from './posts/application/posts.service';
import { PostsQueryRepository } from './posts/infrastructure/posts.query-repository';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { CreateBlogHandler } from './blogs/application/usecases/create-blog.usecase';

@Module({
  imports: [
    CqrsModule,
    AuthModule,
    UsersModule,
  ],
//   controllers: [CommentsController, PostsController, BlogsController],
  controllers: [BlogsController],
  providers: [
    // CommentsService,
    // PostsService,
    BlogsService,
//     CommentsRepository,
//     CommentsQueryRepository,
//     PostsRepository,
//     PostsQueryRepository,
    BlogsRepository,
    BlogsQueryRepository,
    MappingBlogsService,
    // MappingsPostsService,
    QueryParamsService,
    CreateBlogHandler,
//
//     UpdateBlogHandler,
//     MappingsCommentsService, CreateCommentHandler, UpdateCommentHandler, DeleteCommentHandler, UpdateLikeStatusPostHandler, UpdateLikeStatusHandler,
//     CreatePostHandler,UpdatePostHandler,
  ],
  exports: [BlogsService, BlogsQueryRepository, BlogsRepository]
  // exports: [BlogsService, BlogsQueryRepository, BlogsRepository, PostsService, PostsRepository, PostsQueryRepository, CommentsService, CommentsRepository]
})
//
//
export class BloggersPlatformModule {}