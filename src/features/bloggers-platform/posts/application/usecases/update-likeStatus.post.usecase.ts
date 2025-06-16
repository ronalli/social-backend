import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { NotFoundException } from '@nestjs/common';
import { LikeStatus } from '../../../../likes/domain/like.entity';
import { LikeStatusModelForPost } from '../../../../likes/api/models/create-like.input.model';
import { PostsQueryRepository } from '../../infrastructure/posts.query-repository';
import { randomUUID } from 'node:crypto';
import { LikesRepository } from '../../../../likes/infrastructure/likes.repository';
import { PostsTypeOrmQueryRepository } from '../../infrastructure/posts.typeorm.query-repository';

export class UpdateLikeStatusPostCommand {
  constructor(
    public postId: string,
    public userId: string,
    public status: LikeStatus,
    public login: string,
  ) {}
}

@CommandHandler(UpdateLikeStatusPostCommand)
export class UpdateLikeStatusPostHandler
  implements ICommandHandler<UpdateLikeStatusPostCommand>
{
  constructor(
    private readonly postsRepository: PostsRepository,
    // private readonly postsQueryRepository: PostsQueryRepository,
    private readonly likesRepository: LikesRepository,
    private readonly postsQueryTypeOrmRepository: PostsTypeOrmQueryRepository
  ) {}

  async execute(command: UpdateLikeStatusPostCommand): Promise<boolean> {
    const { postId, userId, status, login } = command;

    const foundedPost = await this.postsQueryTypeOrmRepository.isPostDoesExist(postId);

    if (!foundedPost) {
      throw new NotFoundException([
        { message: 'Not found post', field: 'postId' },
      ]);
    }

    const statusLikeOnPost = await this.postsQueryTypeOrmRepository.getLike(postId, userId);

    if (statusLikeOnPost) {
      return await this.likesRepository.updateStatusLikeInPost(command);
    }

    const likeEntity: LikeStatusModelForPost = {
      id: randomUUID(),
      likeStatus: status,
      userId,
      postId,
      createdAt: new Date().toISOString(),
    };

    return await this.likesRepository.addStatusLikeOnPost(likeEntity);
  }
}
