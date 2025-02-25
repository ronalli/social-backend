import { Module } from '@nestjs/common';
import { LikesController } from './api/LikesController';
import { LikesRepository } from './infrastructure/likes.repository';
import { PostsQueryRepository } from '../bloggers-platform/posts/infrastructure/posts.query-repository';
import { PostsRepository } from '../bloggers-platform/posts/infrastructure/posts.repository';
import { LikesService } from './application/likes.service';
import { LikesQueryRepository } from './infrastructure/likes.query-repository';

@Module({
  imports: [PostsQueryRepository, PostsRepository],
  controllers: [LikesController],
  providers: [LikesRepository, LikesQueryRepository, LikesService ],
  exports: [LikesRepository, LikesService, LikesQueryRepository]
})

export class LikesModule {}