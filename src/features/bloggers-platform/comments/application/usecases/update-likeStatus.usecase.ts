import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { LikeStatus } from '../../../../likes/domain/like.entity';
import { CommentsQueryRepository } from '../../infrastructure/comments.query-repository';
import { NotFoundException } from '@nestjs/common';
import { LikesRepository } from '../../../../likes/infrastructure/likes.repository';
import { randomUUID } from 'node:crypto';
import { LikeStatusModelForComment } from '../../../../likes/api/models/create-like.input.model';


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
    private readonly commentsRepository: CommentsRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly likesRepository: LikesRepository
  ) {}

  async execute(command: UpdateLikeStatusCommentCommand): Promise<any> {
    const { commentId, userId, status,} = command;


    const foundedComment = await this.commentsQueryRepository.isCommentDoesExist(commentId);

    if (!foundedComment)
       throw new NotFoundException([
         { message: 'Not found comment', field: 'commentId' },
       ]);


    const statusLikeOnComment = await this.commentsQueryRepository.getLike(commentId, userId);

    if (statusLikeOnComment) {

      return await this.likesRepository.updateStatusLikeInComment(command)
    }

    const like: LikeStatusModelForComment = {
      id: randomUUID(),
      likeStatus: status,
      userId,
      commentId,
      createdAt: new Date().toISOString(),
    }

    return await this.likesRepository.addStatusLikeOnComment(like)

  }
}
