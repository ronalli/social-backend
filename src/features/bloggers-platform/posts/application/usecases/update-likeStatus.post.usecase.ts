
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { Like, LikeModelType, LikeStatus } from '../../../../likes/domain/like.entity';
import { LikeStatusModel } from '../../../../likes/api/models/create-like.input.model';

export class UpdateLikeStatusPostCommand {
  constructor(
    public parentId: string,
    public userId: string,
    public status: LikeStatusModel,
    public login: string,
  ) {}
}

@CommandHandler(UpdateLikeStatusPostCommand)
export class UpdateLikeStatusPostHandler
  implements ICommandHandler<UpdateLikeStatusPostCommand>
{
  constructor(
    private readonly postsRepository: PostsRepository,
    @InjectModel(Like.name) private LikeModel: LikeModelType,
  ) {}

  async execute(command: UpdateLikeStatusPostCommand): Promise<any> {
    // const { parentId, userId, status, login } = command;
    //
    // const post = await this.postsRepository.getPost(parentId);
    //
    // if (!post) {
    //   throw new NotFoundException([
    //     { message: 'Not found post', field: 'postId' },
    //   ]);
    // }
    //
    // const searchLike = await this.postsRepository.getLike(parentId, userId);
    //
    // if (searchLike) {
    //   return await this.postsRepository.updateStatusLike(command, post);
    // }
    //
    // const likeStatusValue = status.likeStatus;
    //
    // if(likeStatusValue === LikeStatus.None) {
    //   return true;
    // }
    //
    // const like = new this.LikeModel({
    //   _id: new Types.ObjectId(),
    //   userId,
    //   parentId,
    //   status: likeStatusValue,
    //   login,
    //   addedAt: new Date().toISOString(),
    // });
    //
    // await this.postsRepository.addStatusLike(like)
    //
    // likeStatusValue === LikeStatus.Like
    //   ? (post.likesCount += 1)
    //   : (post.dislikesCount += 1);
    //
    // await post.save();
    //
    // return true;
  }
}
