import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class LikesQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

//   async getCurrentLikeStatusUser(userId: string, commentId: string) {
//     const query = `SELECT * FROM "commentsLikeStatus" WHERE "userId" = $1 AND "commentId" = $2`;
//
//     return await this.dataSource.query(query, [userId, commentId]);
//   }
}
