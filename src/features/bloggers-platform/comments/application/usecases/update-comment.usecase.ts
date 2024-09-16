import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateCommentModel } from '../../api/models/input/update-comment.model';

export class UpdateCommentCommand {
  constructor(
    public commentId: string,
    public content: UpdateCommentModel,
    public userId: string

  ) {
  }
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler implements ICommandHandler<UpdateCommentCommand> {
  constructor(private readonly commentsRepository: CommentsRepository) {
  }

  async execute(command: UpdateCommentCommand): Promise<any> {

    const {commentId, content, userId} = command;

    const result = await this.commentsRepository.getCommentById(commentId);

    if(!result) throw new NotFoundException([{message: 'Not found comment', field: 'commentId'}])

    if(result && userId !== result.commentatorInfo.userId) {
      throw new ForbiddenException([{message: 'Try edit the comment that is not your own', field: 'userId'}])
    }

    return await this.commentsRepository.updateComment(commentId, content)
  }
}