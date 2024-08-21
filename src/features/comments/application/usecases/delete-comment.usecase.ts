import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResultCode } from '../../../../settings/http.status';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class DeleteCommentCommand {
  constructor(
    public commentId: string,
    public userId: string,
  ) {
  }
}


@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler implements ICommandHandler<DeleteCommentCommand> {
  constructor(
    private readonly commentsRepository: CommentsRepository
  ) {
  }

 async execute(command: DeleteCommentCommand): Promise<boolean> {

    const {commentId, userId} = command;

    const result = await this.commentsRepository.getCommentById(commentId);

    if (!result) {
      throw new NotFoundException([{message: 'Not found comment', field: 'commentId'}])
    }
    if (result && userId !== result.commentatorInfo.userId) {

      throw new ForbiddenException([{message: 'Try edit the comment that is not your own', field: 'userId'}])
    }
    return await this.commentsRepository.deleteComment(commentId);
  }
}