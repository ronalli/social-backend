import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LikeStatusModel } from '../../../../likes/api/models/create-like.input.model';
import { Like, LikeModelType, LikeStatus } from '../../../../likes/domain/like.entity';
import { Types } from 'mongoose';

export class UpdateLikeStatusCommand {
  constructor(
    public parentId: string,
    public userId: string,
    public status: LikeStatusModel,
    public login: string,
  ) {}
}

@CommandHandler(UpdateLikeStatusCommand)
export class UpdateLikeStatusHandler
  implements ICommandHandler<UpdateLikeStatusCommand>
{
  constructor(
    private readonly commentsRepository: CommentsRepository,
    @InjectModel(Like.name) private LikeModel: LikeModelType,
  ) {}

  async execute(command: UpdateLikeStatusCommand): Promise<any> {
    const { parentId, userId, status, login } = command;

    const comment = await this.commentsRepository.getCommentById(parentId);

    if (!comment)
      throw new NotFoundException([
        { message: 'Not found comment', field: 'commentId' },
      ]);

    const searchLike = await this.commentsRepository.getCurrentLike(
      parentId,
      userId,
    );


    if (searchLike) {
      return await this.commentsRepository.updateStatusLike(command, comment);
    }

    const likeStatusValue = status.likeStatus;

    if(likeStatusValue === LikeStatus.None) {
      return true;
    }

    const like = new this.LikeModel({
      _id: new Types.ObjectId(),
      userId,
      parentId,
      status: likeStatusValue,
      login,
      addedAt: new Date().toISOString(),
    });

   await this.commentsRepository.addStatusLike(like);


    likeStatusValue === LikeStatus.Like
      ? (comment.likesCount += 1)
      : (comment.dislikesCount += 1);

    await comment.save();

    return true;
  }
}
