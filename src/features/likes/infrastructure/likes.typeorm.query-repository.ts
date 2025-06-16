import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostLikeStatus } from '../domain/like.post.entity';

@Injectable()
export class LikesTypeOrmQueryRepository {
  constructor(
    // @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(PostLikeStatus)
    private readonly postLikeStatusRepository: Repository<PostLikeStatus>,
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

  // async getCurrentLikeStatusUser(userId: string, commentId: string) {
  //   const query = `SELECT * FROM "commentsLikeStatus" WHERE "userId" = $1 AND "commentId" = $2`;
  //
  //   return await this.dataSource.query(query, [userId, commentId]);
  // }
}
