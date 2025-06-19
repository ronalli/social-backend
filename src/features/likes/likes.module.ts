import { Module } from '@nestjs/common';
import { LikesController } from './api/LikesController';
import { LikesRepository } from './infrastructure/likes.repository';
import { PostsQueryRepository } from '../bloggers-platform/posts/infrastructure/posts.query-repository';
import { PostsRepository } from '../bloggers-platform/posts/infrastructure/posts.repository';
import { LikesService } from './application/likes.service';
import { LikesQueryRepository } from './infrastructure/likes.query-repository';
import { PostLikeStatus } from './domain/like.post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesTypeOrmQueryRepository } from './infrastructure/likes.typeorm.query-repository';
import { CommentLikeStatus } from './domain/like.comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostLikeStatus, CommentLikeStatus]),
    // PostsQueryRepository,
    // PostsRepository,
  ],
  controllers: [LikesController],
  providers: [
    LikesRepository,
    LikesQueryRepository,
    LikesService,
    LikesTypeOrmQueryRepository,
  ],
  exports: [
    LikesRepository,
    LikesService,
    LikesQueryRepository,
    LikesTypeOrmQueryRepository,
  ],
})
export class LikesModule {}
