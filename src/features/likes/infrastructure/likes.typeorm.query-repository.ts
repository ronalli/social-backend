import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostLikeStatus } from '../domain/like.post.entity';
import { CommentLikeStatus } from '../domain/like.comment.entity';

@Injectable()
export class LikesTypeOrmQueryRepository {
  constructor(
    // @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(PostLikeStatus)
    private readonly postLikeStatusRepository: Repository<PostLikeStatus>,
    @InjectRepository(CommentLikeStatus) private readonly commentLikeStatusRepository: Repository<CommentLikeStatus>
  ) {}

  async isLikePostDoesExist(postId: string, userId: string) {
    const query = await this.postLikeStatusRepository.findOne({
      where: {
        userId: userId,
        postId: postId,
      },
    });
    return !!query;
  }

  async isLikeCommentDoesExist(commentId: string, userId: string) {
    const query = await this.commentLikeStatusRepository.findOne({
      where: {
        userId,
        commentId,
      },
    });
    return !!query;
  }

  async getCurrentLikeStatusUser(userId: string, commentId: string) {

   return await this.commentLikeStatusRepository.findOne({
      where: {
        userId,
        commentId,
      }
    })

    // const query = `SELECT * FROM "commentsLikeStatus" WHERE "userId" = $1 AND "commentId" = $2`;

    // return await this.dataSource.query(query, [userId, commentId]);
  }

}
