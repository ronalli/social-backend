import { forwardRef, Module } from '@nestjs/common';
import { BlogsController } from './api/blogs.controller';
import { BlogsService } from './application/blogs.service';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { BlogsQueryRepository } from './infrastructure/blogs.query-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blog.entity';
import { Post, PostSchema } from '../posts/domain/post.entity';
import { Like, LikeSchema } from '../likes/domain/like.entity';
import { QueryParamsService } from '../../common/utils/create.default.values';
import { MappingBlogsService } from './application/mappings/mapping.blogs';
import { MappingsPostsService } from '../posts/application/mappings/mapping.posts';
import { CqrsModule } from '@nestjs/cqrs';
import { PostsModule } from '../posts/posts.module';
import { CreateBlogHandler } from './application/usecases/create-blog.usecase';
import { UpdateBlogHandler } from './application/usecases/update-blog.usecase';

@Module({
  imports: [
    CqrsModule,
    forwardRef(() => PostsModule),
    MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}]),
    MongooseModule.forFeature([{name: Post.name, schema: PostSchema}]),
    MongooseModule.forFeature([{name: Like.name, schema: LikeSchema}])],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository, BlogsQueryRepository, QueryParamsService, MappingBlogsService, MappingsPostsService, CreateBlogHandler, UpdateBlogHandler],
  exports: [BlogsService, BlogsQueryRepository, BlogsRepository]
})

export class BlogsModule {}
