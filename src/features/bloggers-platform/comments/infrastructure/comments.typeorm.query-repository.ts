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
        'u.login AS "userLogin"',
      ])
      // .addSelect((subQuery) => {
      //   if (hasUserId) {
      //     return subQuery
      //       .select(`COALESCE(s."likeStatus", 'None')`, 'myStatus')
      //       .from('commentsLikeStatus', 's')
      //       .where('s.commentId = c.id')
      //       .andWhere('s.userId = :userId', { userId });
      //   } else {
      //     return subQuery.select(`'None'`, 'myStatus').from((qb) => qb.select('1'), 'dummy');
      //   }
      // }, 'myStatus')
      .addSelect(
        `COALESCE((
                 SELECT s."likeStatus"
                 FROM "commentsLikeStatus" s
                 WHERE s."commentId" = c.id AND s."userId" = :userId
                 LIMIT 1
              ), 'None')`,
        'myStatus',
      )
      .setParameter('userId', userId ?? '00000000-0000-0000-0000-000000000000')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)')
          .from('commentsLikeStatus', 'cls')
          .where('cls.commentId = c.id')
          .andWhere(`cls.likeStatus = 'Like'`);
      }, 'likesCount')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)')
          .from('commentsLikeStatus', 'cls')
          .where('cls.commentId = c.id')
          .andWhere(`cls.likeStatus = 'Dislike'`);
      }, 'dislikesCount')
      .innerJoin('users', 'u', 'u.id = c.userId')
      .where('c.id = :commentId', { commentId });

    return await queryBuilder.getRawOne();
  }

  async getAllCommentsFormSpecialPost(
    userId: string,
    postId: string,
    queryParams: CommentQueryDto,
  ) {
    const defaultQueryParams =
      this.queryParamsService.createDefaultValuesQueryParams(queryParams);

    const { sortBy, sortDirection, pageNumber, pageSize } = defaultQueryParams;

    const queryBuilder = this.commentsRepository
      .createQueryBuilder('c')
      .addSelect('c.id', 'id')
      .addSelect('c.content', 'content')
      .addSelect('c.userId', 'userId')
      .addSelect('u.login', 'userLogin')
      .addSelect('c.createdAt', 'createdAt')
      .addSelect((subQuery) => {
        return subQuery
          .select("COALESCE(s.likeStatus, 'None')", 'myStatus')
          .from('commentsLikeStatus', 's')
          .where('s.commentId = c.id')
          .andWhere('s.userId = :userId', { userId });
      })

      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)')
          .from('commentsLikeStatus', 'cls')
          .where('cls.commentId = c.id')
          .andWhere(`cls.likeStatus = 'Like'`);
      }, 'likesCount')

      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)')
          .from('commentsLikeStatus', 'cls')
          .where('cls.commentId = c.id')
          .andWhere(`cls.likeStatus = 'Dislike'`);
      }, 'dislikesCount')
      .where('c.postId = :postId', { postId })
      .innerJoin('users', 'u', 'u.id = c.userId')
      .orderBy(`c."${sortBy}"`, `${sortDirection}`)
      .limit(pageSize)
      .offset(pageSize * (pageNumber - 1));

    const comments = await queryBuilder.getRawMany();

    const totalCount = await queryBuilder.clone().getCount();

    return {
      pagesCount: +Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: comments,
    };
  }

  async isCommentDoesExist(commentId: string): Promise<boolean> {
    const query = await this.commentsRepository.findOne({
      where: {
        id: commentId,
      },
    });
    return !!query;
  }

  async getLike(commentId: string, userId: string): Promise<boolean> {
    const query = `SELECT * FROM public."commentsLikeStatus" WHERE "commentId" = $1 AND "userId" = $2;`;

    const result = await this.dataSource.query(query, [commentId, userId]);

    return result.length > 0;
  }

  async getCommentById(id: string): Promise<CommentOutputModelDB> {
    return await this.commentsRepository.findOne({
      where: {
        id,
      },
    });
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
