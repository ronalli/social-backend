import { Module } from '@nestjs/common';
import { LikesController } from './api/LikesController';
import { LikesRepository } from './infrastructure/likes.repository';
import { PostsQueryRepository } from '../bloggers-platform/posts/infrastructure/posts.query-repository';
import { PostsRepository } from '../bloggers-platform/posts/infrastructure/posts.repository';

@Module({
  imports: [PostsQueryRepository, PostsRepository],
  controllers: [LikesController],
  providers: [LikesRepository],
  exports: [LikesRepository]
})

export class LikesModule {}