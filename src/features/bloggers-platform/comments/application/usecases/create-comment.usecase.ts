import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../../posts/infrastructure/posts.query-repository';
import { NotFoundException } from '@nestjs/common';
import {
  CommentsRepository,
  ILikesInfoViewModel,
} from '../../infrastructure/comments.repository';
import { randomUUID } from 'node:crypto';
import { CommentCreateModel } from '../../api/models/input/create-comment.model';
import { PostsTypeOrmQueryRepository } from '../../../posts/infrastructure/posts.typeorm.query-repository';
import { CommentsTypeOrmRepository } from '../../infrastructure/comments.typeorm.repository';
import { CommentsTypeOrmQueryRepository } from '../../infrastructure/comments.typeorm.query-repository';

export class CreateCommentCommand {
  constructor(
    public content: string,
    public postId: string,
    public userId: string,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    // private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly commentsTypeOrmRepository: CommentsTypeOrmRepository,
    private readonly commentsTypeOrmQueryRepository: CommentsTypeOrmQueryRepository,
    private readonly postsQueryTypeOrmRepository: PostsTypeOrmQueryRepository
    // private readonly usersQueryRepository: UsersQueryRepository,
    // private readonly mappingsCommentsService: MappingsCommentsService,
  ) {}

  async execute(command: CreateCommentCommand): Promise<string> {
    const { content, postId, userId } = command;

    const findPost = await this.postsQueryTypeOrmRepository.findPostById(postId);

    if (!findPost) {
      throw new NotFoundException([
        { message: 'Not found postId', field: 'postId' },
      ]);
    }

    // const result = await this.usersQueryRepository.findUserById(userId);

    const newComment: CommentCreateModel = {
      id: randomUUID(),
      content,
      postId,
      userId,
      createdAt: new Date(),
    };

    return await this.commentsTypeOrmRepository.createComment(newComment);

  }
}
