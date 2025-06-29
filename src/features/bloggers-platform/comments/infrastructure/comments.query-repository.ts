import { Injectable } from '@nestjs/common';
import { MappingsCommentsService } from '../application/mappings/mapping.comments';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentOutputModelDB } from '../api/models/output/comment.output.model';
import { CommentQueryDto } from '../api/models/comment-query.dto';
import { QueryParamsService } from '../../../../common/utils/create.default.values';
import { createOrderByClause } from '../../../../common/utils/orderByClause';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    private readonly mappingsCommentsService: MappingsCommentsService,
    public queryParamsService: QueryParamsService,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  // async getComment(commentId: string, userId: string) {
  //   const hasUserId = userId !== null && userId !== undefined;
  //
  //   const values = hasUserId ? [commentId, userId] : [commentId];
  //
  //
  //
  //
  //   const query1 = `
  //     SELECT
  //       c.id,
  //       c.content,
  //       c."userId",
  //       c."createdAt",
  //       u.login AS "userLogin",
  //       COALESCE( ${hasUserId ? `s."likeStatus"` : `'None'`},
  //         'None'
  //         ) AS "myStatus",
  //       (SELECT COUNT(*) FROM public."commentsLikeStatus" WHERE "commentId" = c.id AND "likeStatus" = 'Like') AS "likesCount",
  //       (SELECT COUNT(*) FROM public."commentsLikeStatus" WHERE "commentId" = c.id AND "likeStatus" = 'Dislike') AS "dislikesCount"
  //     FROM public."commentsPosts" c
  //     JOIN public.users u ON u.id = c."userId"
  //     LEFT JOIN public."commentsLikeStatus" s ON s."commentId" = c.id ${hasUserId ? `AND s."userId" = $2` : ``}
  //     WHERE c.id = $1
  //     ;
  //   `;
  //
  //   //   COALESCE(
  //   //     CASE
  //   //   WHEN $2 IS NULL THEN 'None'
  //   //   ELSE s."likeStatus"
  //   //   END,
  //   //     'None'
  //   // ) AS "myStatus",
  //
  //   // LEFT JOIN public."commentsLikeStatus" s ON s."commentId" = c.id AND (s."userId" = $2 OR $2 IS NULL)
  //
  //   // LEFT JOIN public."commentsLikeStatus" s ON s."commentId" = c.id AND s."userId" = $1
  //
  //   const result = await this.dataSource.query(query1, values);
  //
  //   return result[0];
  // }

  // async getAllCommentsFormSpecialPost(
  //   userId: string,
  //   postId: string,
  //   queryParams: CommentQueryDto,
  // ) {
  //   const defaultQueryParams =
  //     this.queryParamsService.createDefaultValuesQueryParams(queryParams);
  //
  //   const { sortBy, sortDirection, pageNumber, pageSize } = defaultQueryParams;
  //
  //   const totalCountQuery = `SELECT * FROM "commentsPosts" WHERE "postId" = $1;`;
  //
  //   const totalCount = await this.dataSource.query(totalCountQuery, [postId]);
  //
  //   const pagesCount = Math.ceil(totalCount.length / pageSize);
  //
  //   const orderByClause = createOrderByClause(sortBy, sortDirection);
  //
  //   const query = `
  //       WITH result AS (
  //         SELECT
  //         c.id,
  //         c.content,
  //         c."userId",
  //         c."createdAt",
  //         u.login AS "userLogin",
  //         COALESCE(s."likeStatus", 'None') AS "myStatus",
  //         (SELECT COUNT(*) FROM public."commentsLikeStatus" WHERE "commentId" = c.id AND "likeStatus" = 'Like') AS "likesCount",
  //         (SELECT COUNT(*) FROM public."commentsLikeStatus" WHERE "commentId" = c.id AND "likeStatus" = 'Dislike') AS "dislikesCount"
  //         FROM public."commentsPosts" c
  //         JOIN public.users u ON u.id = c."userId"
  //         LEFT JOIN public."commentsLikeStatus" s ON s."commentId" = c.id AND s."userId" = $1
  //         WHERE "postId" = $2
  //         )
  //       SELECT * FROM result
  //       ORDER BY ${orderByClause}
  //       LIMIT ${pageSize} OFFSET ${pageSize * (pageNumber - 1)}
  //       `;
  //
  //   const result = await this.dataSource.query(query, [userId, postId]);
  //
  //   return {
  //     pagesCount: +pagesCount,
  //     page: +pageNumber,
  //     pageSize: +pageSize,
  //     totalCount: +totalCount.length,
  //     items: result,
  //   };
  // }

  // async isCommentDoesExist(commentId: string): Promise<boolean> {
  //   const query = `SELECT * FROM public."commentsPosts" WHERE id = $1;`;
  //
  //   const result = await this.dataSource.query(query, [commentId]);
  //
  //   return result.length > 0;
  // }

  // async getLike(commentId: string, userId: string): Promise<boolean> {
  //   const query = `SELECT * FROM public."commentsLikeStatus" WHERE "commentId" = $1 AND "userId" = $2;`;
  //
  //   const result = await this.dataSource.query(query, [commentId, userId]);
  //
  //   return result.length > 0;
  // }
  //
  // async getCommentById(id: string): Promise<CommentOutputModelDB> {
  //   const query = `SELECT * FROM "commentsPosts" WHERE id = $1;`;
  //
  //   const result = await this.dataSource.query(query, [id]);
  //
  //   return result[0];
  //
  //   // try {
  //   //   const findComment = await this.CommentModel.findOne({
  //   //     _id: new ObjectId(id),
  //   //   });
  //   //
  //   //   if (findComment) {
  //   //     return {
  //   //       status: ResultCode.Success,
  //   //       data: this.mappingsCommentsService.formatDataCommentForView(
  //   //         findComment,
  //   //       ),
  //   //     };
  //   //   }
  //   //   return {
  //   //     errorMessage: 'Not found comment',
  //   //     status: ResultCode.NotFound,
  //   //     data: null,
  //   //   };
  //   // } catch (e) {
  //   //   throw new InternalServerErrorException(e);
  //   // }
  // }
  //
  // async getCurrentLike(parentId: string, userId: string) {
  //   // const response = await this.LikeModel.findOne({
  //   //   $and: [{ userId: userId }, { parentId: parentId }],
  //   // });
  //   //
  //   // if (response) {
  //   //   return response;
  //   // }
  //   //
  //   // return response;
  // }
  //
  // async getLikeById(likeId: string) {
  //   // return this.LikeModel.findOne({
  //   //   _id: new ObjectId(likeId),
  //   // });
  // }
}
