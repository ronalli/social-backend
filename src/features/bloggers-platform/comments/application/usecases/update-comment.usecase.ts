import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { InputCommentModel } from '../../api/models/input/update-comment.model';
import { CommentsQueryRepository } from '../../infrastructure/comments.query-repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class UpdateCommentCommand {
  constructor(
    public commentId: string,
    public content: InputCommentModel,
    public userId: string,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async execute(command: UpdateCommentCommand): Promise<any> {
    const { commentId, content, userId } = command;

    const result = await this.commentsQueryRepository.getCommentById(commentId);

    if (!result)
      throw new NotFoundException([
        { message: 'Not found comment', field: 'commentId' },
      ]);

    if (result && userId !== result.userId) {
      throw new ForbiddenException([
        {
          message: 'Try edit the comment that is not your own',
          field: 'userId',
        },
      ]);
    }

    return await this.commentsRepository.updateComment(commentId, content);
  }
}
