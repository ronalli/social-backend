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
    private readonly commentRepository: Repository<CommentLikeStatus>,
    @InjectRepository(PostLikeStatus)
    private readonly postRepository: Repository<PostLikeStatus>,
  ) {}

  async addStatusLikeOnPost(
    likeStatusPost: LikeStatusModelForPost,
  ): Promise<boolean> {
    const query = this.postRepository.create(likeStatusPost);

    const result = await this.postRepository.save(query);

    return !!result;
  }

  async updateStatusLikeInPost(
    likeStatusPost: UpdateLikeStatusPostCommand,
  ): Promise<boolean> {
    const { postId, status, userId } = likeStatusPost;

    const query = await this.postRepository.update(postId, {
      likeStatus: status,
      userId,
    });

    return query.affected === 1;
  }

  async updateStatusLikeInComment(
    likeStatusComment: UpdateLikeStatusCommentCommand,
  ): Promise<boolean> {
    const { commentId, status, userId } = likeStatusComment;

    const query = await this.commentRepository.update(commentId, {
      likeStatus: status,
      userId,
    });

    return query.affected === 1;
  }

  async addStatusLikeOnComment(
    likeStatusPost: LikeStatusModelForComment,
  ): Promise<boolean> {
    const query = this.commentRepository.create(likeStatusPost);

    const result = await this.commentRepository.save(query);

    return !!result;
  }
}
