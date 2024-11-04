// import { Module } from '@nestjs/common';
// import { CommentsController } from './comments/api/comments.controller';
// import { PostsController } from './posts/api/posts.controller';
// import { BlogsController } from './blogs/api/blogs.controller';
// import { CommentsService } from './comments/application/comments.service';
// import { BlogsService } from './blogs/application/blogs.service';
// import { PostsService } from './posts/application/posts.service';
// import { CqrsModule } from '@nestjs/cqrs';
// import { AuthModule } from '../auth/auth.module';
// import { UsersModule } from '../users/users.module';
// import { CommentsRepository } from './comments/infrastructure/comments.repository';
// import { CommentsQueryRepository } from './comments/infrastructure/comments.query-repository';
// import { PostsRepository } from './posts/infrastructure/posts.repository';
// import { PostsQueryRepository } from './posts/infrastructure/posts.query-repository';
// import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
// import { BlogsQueryRepository } from './blogs/infrastructure/blogs.query-repository';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Blog, BlogSchema } from './blogs/domain/blog.entity';
// import { Post, PostSchema } from './posts/domain/post.entity';
// import { Like, LikeSchema } from '../likes/domain/like.entity';
// import { Comment, CommentSchema } from './comments/domain/comment.entity';
// import { QueryParamsService } from '../../common/utils/create.default.values';
// import { MappingBlogsService } from './blogs/application/mappings/mapping.blogs';
// import { MappingsPostsService } from './posts/application/mappings/mapping.posts';
// import { CreateBlogHandler } from './blogs/application/usecases/create-blog.usecase';
// import { MappingsCommentsService } from './comments/application/mappings/mapping.comments';
// import { CreateCommentHandler } from './comments/application/usecases/create-comment.usecase';
// import { UpdateCommentHandler } from './comments/application/usecases/update-comment.usecase';
// import { DeleteCommentHandler } from './comments/application/usecases/delete-comment.usecase';
// import { UpdateLikeStatusPostHandler } from './posts/application/usecases/update-likeStatus.post.usecase';
// import { UpdateLikeStatusHandler } from './comments/application/usecases/update-likeStatus.usecase';
// import { CreatePostHandler } from './posts/application/usecases/create-post.usecase';
// import { UpdatePostHandler } from './posts/application/usecases/update-post.usecase';
// import { UpdateBlogHandler } from './blogs/application/usecases/update-blog.usecase';
//
// @Module({
//   imports: [
//     CqrsModule,
//     AuthModule,
//     UsersModule,
//     MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}]),
//     MongooseModule.forFeature([{name: Post.name, schema: PostSchema}]),
//     MongooseModule.forFeature([{name: Like.name, schema: LikeSchema}]),
//     MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]),
//   ],
//   controllers: [CommentsController, PostsController, BlogsController],
//   providers: [
//     CommentsService,
//     PostsService,
//     BlogsService,
//     CommentsRepository,
//     CommentsQueryRepository,
//     PostsRepository,
//     PostsQueryRepository,
//     BlogsRepository,
//     BlogsQueryRepository,
//     QueryParamsService, MappingBlogsService, MappingsPostsService,
//     CreateBlogHandler, UpdateBlogHandler,
//     MappingsCommentsService, CreateCommentHandler, UpdateCommentHandler, DeleteCommentHandler, UpdateLikeStatusPostHandler, UpdateLikeStatusHandler,
//     CreatePostHandler,UpdatePostHandler,
//   ],
//   exports: [BlogsService, BlogsQueryRepository, BlogsRepository, PostsService, PostsRepository, PostsQueryRepository, CommentsService, CommentsRepository]
// })
//
//
// export class BloggersPlatformModule {}