import { BlogsController } from './blogs/api/blogs.controller';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { BlogsQueryRepository } from './blogs/infrastructure/blogs.query-repository';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { MappingsPostsService } from './posts/application/mappings/mapping.posts';
// import { MappingBlogsService } from './blogs/application/mappings/mapping.blogs';
import { QueryParamsService } from '../../common/utils/create.default.values';
import { PostsService } from './posts/application/posts.service';
import { PostsQueryRepository } from './posts/infrastructure/posts.query-repository';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { CreateBlogHandler } from './blogs/application/usecases/create-blog.usecase';
import { UpdateBlogHandler } from './blogs/application/usecases/update-blog.usecase';
import { PostsController } from './posts/api/posts.controller';
import { CreatePostHandler } from './posts/application/usecases/create-post.usecase';
import { CreateCommentHandler } from './comments/application/usecases/create-comment.usecase';
import { MappingsCommentsService } from './comments/application/mappings/mapping.comments';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from './comments/infrastructure/comments.query-repository';
import { CommentsController } from './comments/api/comments.controller';
import { CommentsService } from './comments/application/comments.service';
import { UpdateLikeStatusPostHandler } from './posts/application/usecases/update-likeStatus.post.usecase';
import { LikesRepository } from '../likes/infrastructure/likes.repository';
import { UpdateLikeStatusCommentHandler } from './comments/application/usecases/update-likeStatus.usecase';
import { UpdateCommentHandler } from './comments/application/usecases/update-comment.usecase';
import { DeleteCommentHandler } from './comments/application/usecases/delete-comment.usecase';
import { LikesService } from '../likes/application/likes.service';
import { LikesQueryRepository } from '../likes/infrastructure/likes.query-repository';
import { UpdatePostHandler } from './posts/application/usecases/update-post.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blogs/domain/blog.entity';
import { BlogsTypeOrmRepository } from './blogs/infrastructure/blogs.typeorm.repository';
import { BlogsTypeOrmQueryRepository } from './blogs/infrastructure/blogs.typeorm.query-repository';
import { Post } from './posts/domain/post.entity';
import { PostsTypeOrmRepository } from './posts/infrastructure/posts.typeorm.repository';
import { PostsTypeOrmQueryRepository } from "./posts/infrastructure/posts.typeorm.query-repository";


@Module({
  imports: [TypeOrmModule.forFeature([Blog, Post]),CqrsModule, AuthModule, UsersModule],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    PostsService,
    PostsRepository,
    PostsTypeOrmQueryRepository,
    PostsTypeOrmRepository,
    PostsQueryRepository,
    BlogsService,
    BlogsRepository,
    BlogsTypeOrmRepository,
    BlogsQueryRepository,
    BlogsTypeOrmQueryRepository,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    LikesRepository,
    LikesService,
    LikesQueryRepository,
    // MappingBlogsService,
    MappingsPostsService,
    QueryParamsService,
    CreateBlogHandler,
    UpdateBlogHandler,
    CreatePostHandler,
    CreateCommentHandler,
    MappingsCommentsService,
    UpdateLikeStatusPostHandler,
    UpdateLikeStatusCommentHandler,
    UpdateCommentHandler,
    DeleteCommentHandler,
    UpdatePostHandler,
  ],
  exports: [
    BlogsService,
    BlogsQueryRepository,
    BlogsRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
  ],
})
export class BloggersPlatformModule {}
