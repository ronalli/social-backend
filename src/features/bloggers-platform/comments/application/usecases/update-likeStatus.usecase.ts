import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { LikeStatus } from '../../../../likes/domain/like.entity';
import { CommentsQueryRepository } from '../../infrastructure/comments.query-repository';
import { NotFoundException } from '@nestjs/common';
import { LikesRepository } from '../../../../likes/infrastructure/likes.repository';
import { randomUUID } from 'node:crypto';
import { LikeStatusModelForComment } from '../../../../likes/api/models/create-like.input.model';
import { CommentsTypeOrmQueryRepository } from '../../infrastructure/comments.typeorm.query-repository';
import { LikesTypeOrmQueryRepository } from '../../../../likes/infrastructure/likes.typeorm.query-repository';
import { LikesTypeOrmRepository } from '../../../../likes/infrastructure/likes.typeorm.repository';

export class UpdateLikeStatusCommentCommand {
  constructor(
    public commentId: string,
    public userId: string,
    public status: LikeStatus,
  ) {}
}

@CommandHandler(UpdateLikeStatusCommentCommand)
export class UpdateLikeStatusCommentHandler
  implements ICommandHandler<UpdateLikeStatusCommentCommand>
{
  constructor(
    private readonly commentsTypeOrmQueryRepository: CommentsTypeOrmQueryRepository,
    private readonly likesTypeOrmRepository: LikesTypeOrmRepository,
    private readonly likesTypeOrmQueryRepository: LikesTypeOrmQueryRepository,
  ) {}

  async execute(command: UpdateLikeStatusCommentCommand): Promise<any> {
    const { commentId, userId, status } = command;

    const foundedComment =
      await this.commentsTypeOrmQueryRepository.isCommentDoesExist(commentId);

    if (!foundedComment)
      throw new NotFoundException([
        { message: 'Not found comment', field: 'commentId' },
      ]);

    const statusLikeOnComment = await this.likesTypeOrmQueryRepository.isLikeCommentDoesExist(
      commentId,
      userId,
    );

    if (statusLikeOnComment) {
      return await this.likesTypeOrmRepository.updateStatusLikeInComment(command);
    }

    const like: LikeStatusModelForComment = {
      id: randomUUID(),
      likeStatus: status,
      userId,
      commentId,
      createdAt: new Date(),
    };

    return await this.likesTypeOrmRepository.addStatusLikeOnComment(like);
  }
}
