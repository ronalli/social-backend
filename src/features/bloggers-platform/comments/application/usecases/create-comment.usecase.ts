import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../../posts/infrastructure/posts.query-repository';
import { NotFoundException } from '@nestjs/common';
import {
  CommentsRepository,
  ILikesInfoViewModel,
} from '../../infrastructure/comments.repository';
import { randomUUID } from 'node:crypto';
import { CommentCreateModel } from '../../api/models/input/create-comment.model';

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
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsRepository: CommentsRepository,
    // private readonly usersQueryRepository: UsersQueryRepository,
    // private readonly mappingsCommentsService: MappingsCommentsService,
  ) {}

  async execute(command: CreateCommentCommand): Promise<any> {
    const { content, postId, userId } = command;

    const findPost = await this.postsQueryRepository.findPostById(postId);

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
      createdAt: new Date().toISOString(),
    };

    return await this.commentsRepository.createComment(newComment);

    // try {
    //   const newComment = new this.CommentModel({
    //     _id: new Types.ObjectId(),
    //     postId: postId,
    //     content: content,
    //     createdAt: new Date().toISOString(),
    //     commentatorInfo: {
    //       userId: userId,
    //       userLogin: result.login,
    //     },
    //     likesCount: 0,
    //     dislikesCount: 0,
    //   });
    //   const response = await newComment.save();
    //   const comment = await this.CommentModel.findOne({
    //     _id: new ObjectId(response._id),
    //   });
    //
    //   const likesInfo: ILikesInfoViewModel = {
    //     likesCount: 0,
    //     dislikesCount: 0,
    //     myStatus: 'None',
    //   };
    //
    //   if (comment) {
    //     return this.mappingsCommentsService.formatCommentForView(
    //       comment,
    //       likesInfo,
    //     );
    //   }
    //
    //   return false;
    // } catch (e) {
    //   throw new InternalServerErrorException(e);
    // }
  }
}
