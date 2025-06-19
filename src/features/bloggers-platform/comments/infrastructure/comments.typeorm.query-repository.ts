import { Injectable } from '@nestjs/common';
import { MappingsCommentsService } from '../application/mappings/mapping.comments';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentOutputModelDB } from '../api/models/output/comment.output.model';
import { CommentQueryDto } from '../api/models/comment-query.dto';
import { QueryParamsService } from '../../../../common/utils/create.default.values';
import { createOrderByClause } from '../../../../common/utils/orderByClause';
import { Comment } from '../domain/comment.entity';

@Injectable()
export class CommentsTypeOrmQueryRepository {
  constructor(
    private readonly mappingsCommentsService: MappingsCommentsService,
    public queryParamsService: QueryParamsService,
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}

  async getComment(commentId: string, userId: string) {
    const hasUserId = userId !== null && userId !== undefined;

    const queryBuilder = this.commentsRepository
      .createQueryBuilder('c')
      .select([
        'c.id AS id',
        'c.content AS content',
        'c.userId AS "userId"',
        'c.createdAt AS "createdAt"',
        'u.login AS "userLogin"'
      ])
      .addSelect((subQuery) => {
        if(hasUserId) {
          return subQuery.select(`COALESCE(s."likeStatus", 'None')`, 'myStatus')
            .from('commentsLikeStatus', 's')
            .where('s.commentId = c.id')
            .andWhere('s.userId = :userId', { userId })
        } else {
          return subQuery.select(`'None'`, 'myStatus');
        }
      }, 'myStatus')
      .addSelect((subQuery) => {
        return subQuery.select('COUNT(*)')
          .from('commentsLikeStatus', 'cls')
          .where('cls.commentId = c.id')
          .andWhere(`cls.likeStatus = 'Like'`)
      }, 'likesCount')
      .addSelect((subQuery) => {
        return subQuery.select('COUNT(*)')
          .from('commentsLikeStatus', 'cls')
          .where('cls.commentId = c.id')
          .andWhere(`cls.likeStatus = 'Dislike'`)
      }, 'dislikesCount')
      .innerJoin('users', 'u', 'u.id = c.userId')
      .where('c.id = :commentId', {commentId})

    return  await queryBuilder.getRawOne();
  }

  async getAllCommentsFormSpecialPost(
    userId: string,
    postId: string,
    queryParams: CommentQueryDto,
  ) {
    const defaultQueryParams =
      this.queryParamsService.createDefaultValuesQueryParams(queryParams);

    const { sortBy, sortDirection, pageNumber, pageSize } = defaultQueryParams;

    const totalCountQuery = `SELECT * FROM "commentsPosts" WHERE "postId" = $1;`;

    const totalCount = await this.dataSource.query(totalCountQuery, [postId]);

    const pagesCount = Math.ceil(totalCount.length / pageSize);

    const orderByClause = createOrderByClause(sortBy, sortDirection);

    const query = `
        WITH result AS (
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
          WHERE "postId" = $2 
          ) 
        SELECT * FROM result
        ORDER BY ${orderByClause}
        LIMIT ${pageSize} OFFSET ${pageSize * (pageNumber - 1)}
        `;

    const result = await this.dataSource.query(query, [userId, postId]);

    return {
      pagesCount: +pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount.length,
      items: result,
    };
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
