import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommentsQueryRepository } from '../../infrastructure/comments.query-repository';

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
    private readonly commentsRepository: CommentsRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {
  }

  async execute(command: DeleteCommentCommand) {

    const {commentId, userId} = command;

    const result = await this.commentsQueryRepository.getCommentById(commentId);

    if (!result) {
      throw new NotFoundException([{message: 'Not found comment', field: 'commentId'}])
    }
    if (result && userId !== result.userId) {

      throw new ForbiddenException([{message: 'Try edit the comment that is not your own', field: 'userId'}])
    }
    return await this.commentsRepository.deleteComment(commentId);
  }
}