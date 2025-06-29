import { Injectable } from '@nestjs/common';
import {
  LikeStatusModelForComment,
  LikeStatusModelForPost,
} from '../api/models/create-like.input.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UpdateLikeStatusPostCommand } from '../../bloggers-platform/posts/application/usecases/update-likeStatus.post.usecase';
import { UpdateLikeStatusCommentCommand } from '../../bloggers-platform/comments/application/usecases/update-likeStatus.usecase';
import { CommentLikeStatus } from '../domain/like.comment.entity';
import { PostLikeStatus } from '../domain/like.post.entity';

@Injectable()
export class LikesTypeOrmRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(CommentLikeStatus)
    private readonly commentLikeRepository: Repository<CommentLikeStatus>,
    @InjectRepository(PostLikeStatus)
    private readonly postLikeRepository: Repository<PostLikeStatus>,
  ) {}

  async addStatusLikeOnPost(
    likeStatusPost: LikeStatusModelForPost,
  ): Promise<boolean> {
    const query = this.postLikeRepository.create(likeStatusPost);

    const result = await this.postLikeRepository.save(query);

    return !!result;
  }

  async updateStatusLikeInPost(
    likeStatusPost: UpdateLikeStatusPostCommand,
  ): Promise<boolean> {
    const { postId, status, userId } = likeStatusPost;

    const query = await this.postLikeRepository.update(
      { postId, userId },
      {
        likeStatus: status,
      },
    );

    return query.affected === 1;
  }

  async updateStatusLikeInComment(
    likeStatusComment: UpdateLikeStatusCommentCommand,
  ): Promise<boolean> {
    const { commentId, status, userId } = likeStatusComment;

    const query = await this.commentLikeRepository.update(
      { commentId, userId },
      {
        likeStatus: status,
      },
    );

    return query.affected === 1;
  }

  async addStatusLikeOnComment(
    likeStatusPost: LikeStatusModelForComment,
  ): Promise<boolean> {
    const query = this.commentLikeRepository.create(likeStatusPost);

    const result = await this.commentLikeRepository.save(query);

    return !!result;
  }
}
