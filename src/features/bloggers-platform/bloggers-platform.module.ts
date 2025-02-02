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
import { UpdateBlogHandler } from './blogs/application/usecases/update-blog.usecase';
import { PostsController } from './posts/api/posts.controller';
import { CreatePostHandler } from './posts/application/usecases/create-post.usecase';

@Module({
  imports: [
    CqrsModule,
    AuthModule,
    UsersModule,
  ],
//   controllers: [CommentsController, PostsController, BlogsController],
  controllers: [BlogsController, PostsController],
  providers: [
    // CommentsService,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
//     CommentsRepository,
//     CommentsQueryRepository,


    MappingBlogsService,
    MappingsPostsService,
    QueryParamsService,
    CreateBlogHandler,
    UpdateBlogHandler,
    CreatePostHandler,
//     MappingsCommentsService, CreateCommentHandler, UpdateCommentHandler, DeleteCommentHandler, UpdateLikeStatusPostHandler, UpdateLikeStatusHandler,
//     UpdatePostHandler,
  ],
  exports: [BlogsService, BlogsQueryRepository, BlogsRepository, PostsService, PostsRepository, PostsQueryRepository]
  // exports: [BlogsService, BlogsQueryRepository, BlogsRepository, PostsService, PostsRepository, PostsQueryRepository, CommentsService, CommentsRepository]
})
//
//
export class BloggersPlatformModule {}