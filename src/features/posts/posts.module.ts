import { forwardRef, Module } from '@nestjs/common';
import { PostsController } from './api/posts.controller';
import { PostsService } from './application/posts.service';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsQueryRepository } from './infrastructure/posts.query-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from '../likes/domain/like.entity';
import { MappingsPostsService } from './application/mappings/mapping.posts';
import { Post, PostSchema } from './domain/post.entity';
import { QueryParamsService } from '../../common/utils/create.default.values';
import { AuthModule } from '../auth/auth.module';
import { BlogsModule } from '../blogs/blogs.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommentsModule } from '../comments/comments.module';
import { CreatePostHandler } from './application/usecases/create-post.usecase';
import { UpdatePostHandler } from './application/usecases/update-post.usecase';

@Module({
  imports: [CqrsModule, MongooseModule.forFeature([{name: Like.name, schema: LikeSchema}]), MongooseModule.forFeature([{name: Post.name, schema: PostSchema}]), AuthModule, forwardRef(() => BlogsModule), forwardRef( () => CommentsModule) ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, PostsQueryRepository, MappingsPostsService, QueryParamsService, CreatePostHandler,UpdatePostHandler],
  exports: [PostsService, PostsRepository, PostsQueryRepository]
})

export class PostsModule {}
