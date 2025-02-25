import { ObjectId } from 'mongodb';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Comment, CommentModelType } from '../domain/comment.entity';
import { MappingsCommentsService } from '../application/mappings/mapping.comments';
import { ResultCode } from '../../../../settings/http.status';
import { LikeInfoOutputModel } from '../../../likes/api/models/like.info.output.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentOutputModelDB } from '../api/models/output/comment.output.model';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    private readonly mappingsCommentsService: MappingsCommentsService,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async getComment(id: string, userId: string) {
    // const query = `SELECT * FROM public."commentsPosts" WHERE id = $1;`;
    //
    // const response = await this.dataSource.query(query, [id]);
    //
    // console.log(status);

    const query1 = `
      SELECT 
        c.id,
        c.content,
        c."userId",
        c."createdAt",
        u.login AS "userLogin",
        COALESCE(s."likeStatus", 'None') AS "myStatus",
        (SELECT COUNT(*) FROM public."commentsLikeStatus" WHERE "commentId" = c.id AND "likeStatus" = 'Like') AS "likesCount",
        (SELECT COUNT(*) FROM public."commentsLikeStatus" WHERE "commentId" = c.id AND "likeStatus" = 'Dislike') AS "dislikesCount"
      FROM public."commentsPosts" c 
      JOIN public.users u ON u.id = c."userId"
      LEFT JOIN public."commentsLikeStatus" s ON s."commentId" = c.id AND s."userId" = $1
      WHERE c.id = $2
      ;
    `;

    const result = await this.dataSource.query(query1, [userId, id]);

    return result[0];

    // [
    //   {
    //     id: 'dce1c46c-71f6-4319-82fe-eae94210c3fe',
    //     content: 'hello my friends and all people world',
    //     postId: 'ed5310ca-a727-49cc-b4ec-3a77806f4397',
    //     userId: '236e918e-cd09-49f5-85f7-44c1fd785038',
    //     createdAt: '2025-02-14T19:58:22.761Z'
    //   }
    // ]

    // try {
    //   const currentComment = await this.CommentModel.findOne({
    //     _id: new ObjectId(id),
    //   });
    //
    //   if (currentComment) {
    //     const likesInfo: LikeInfoOutputModel = {
    //       likesCount: currentComment.likesCount,
    //       dislikesCount: currentComment.dislikesCount,
    //       myStatus: status,
    //     };
    //     return this.mappingsCommentsService.formatCommentForView(
    //       currentComment,
    //       likesInfo,
    //     );
    //   }
    //
    //   return false;
    // } catch (e) {
    //   throw new InternalServerErrorException(e);
    // }
  }

  async isCommentDoesExist(commentId: string): Promise<boolean> {
    const query = `SELECT * FROM public."commentsPosts" WHERE id = $1;`;

    const result = await this.dataSource.query(query, [commentId]);

    return result.length > 0;
  }

  async getLike(commentId: string, userId: string): Promise<boolean> {
    const query = `SELECT * FROM public."commentsLikeStatus" WHERE "commentId" = $1 AND "userId" = $2;`;

    const result = await this.dataSource.query(query, [commentId, userId]);

    return result.length > 0;
  }

  async getCommentById(id: string): Promise<CommentOutputModelDB> {
    const query = `SELECT * FROM "commentsPosts" WHERE id = $1;`;

    const result = await this.dataSource.query(query, [id]);

    return result[0];

    // try {
    //   const findComment = await this.CommentModel.findOne({
    //     _id: new ObjectId(id),
    //   });
    //
    //   if (findComment) {
    //     return {
    //       status: ResultCode.Success,
    //       data: this.mappingsCommentsService.formatDataCommentForView(
    //         findComment,
    //       ),
    //     };
    //   }
    //   return {
    //     errorMessage: 'Not found comment',
    //     status: ResultCode.NotFound,
    //     data: null,
    //   };
    // } catch (e) {
    //   throw new InternalServerErrorException(e);
    // }
  }

  async getCurrentLike(parentId: string, userId: string) {
    // const response = await this.LikeModel.findOne({
    //   $and: [{ userId: userId }, { parentId: parentId }],
    // });
    //
    // if (response) {
    //   return response;
    // }
    //
    // return response;
  }

  async getLikeById(likeId: string) {
    // return this.LikeModel.findOne({
    //   _id: new ObjectId(likeId),
    // });
  }
}
