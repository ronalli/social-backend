import { Injectable, NotFoundException } from '@nestjs/common';
import { PostQueryDto } from '../api/models/post-query.dto';
import { MappingsPostsService } from '../application/mappings/mapping.posts';
import { QueryParamsService } from '../../../../common/utils/create.default.values';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostOutputModelDB } from '../api/models/output/post.output.model';
import { Post } from '../domain/post.entity';
import { LikesTypeOrmQueryRepository } from '../../../likes/infrastructure/likes.typeorm.query-repository';

@Injectable()
export class PostsTypeOrmQueryRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly likesTypeOrmQueryRepository: LikesTypeOrmQueryRepository,
    private readonly queryParamsService: QueryParamsService,
    private readonly mappingsPostsService: MappingsPostsService,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async getPosts(queryParams: PostQueryDto, userId: string) {
    const defaultQueryParams =
      this.queryParamsService.createDefaultValues(queryParams);

    const { pageNumber, pageSize, sortBy, sortDirection } = defaultQueryParams;

    // const orderByClause = createOrderByClause(sortBy, sortDirection);

    const queryBuilder = this.postRepository
      .createQueryBuilder('p')
      .addSelect('p.id', 'id')
      .addSelect('p.title', 'title')
      .addSelect('p.content', 'content')
      .addSelect('p.shortDescription', 'shortDescription')
      .addSelect('p.blogId', 'blogId')
      .addSelect('b.name', 'blogName')
      .addSelect('p.createdAt', 'createdAt')

      .addSelect((subQuery) => {
        return subQuery
          .select("COALESCE(s.likeStatus, 'None')", 'myStatus')
          .from('postsLikeStatus', 's')
          .where('s.postId = p.id')
          .andWhere('s.userId = :userId', { userId });
      }, 'myStatus')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)')
          .from('postsLikeStatus', 'pls')
          .where('pls.postId = p.id')
          .andWhere("pls.likeStatus = 'Like'");
      }, 'likesCount')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)')
          .from('postsLikeStatus', 'pls')
          .where('pls.postId = p.id')
          .andWhere("pls.likeStatus = 'Dislike'");
      }, 'dislikesCount')
      .addSelect((subQuery) => {
        return subQuery.select(`json_agg(likes)`).from((qb) => {
          return qb
            .select('pls.userId', 'userId')
            .addSelect('u.login', 'login')
            .addSelect('pls.createdAt', 'addedAt')
            .from('postsLikeStatus', 'pls')
            .innerJoin('users', 'u', 'u.id = pls."userId"')
            .where('pls."postId" = p.id')
            .andWhere(`pls."likeStatus" = 'Like'`)
            .orderBy('pls."createdAt"', 'DESC')
            .limit(3);
        }, 'likes');
      }, 'newestLikes')
      .innerJoin('blogs', 'b', 'b.id = p.blogId')
      .orderBy(`"${sortBy}"`, `${sortDirection}`)
      .limit(pageSize)
      .offset(pageSize * (pageNumber - 1));

    const posts = await queryBuilder.getRawMany();

    const totalCount = await queryBuilder.clone().getCount();

    return {
      pagesCount: +Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: posts,
    };
  }

  async getPost(postId: string, userId: string) {
    const queryBuilder = this.postRepository
      .createQueryBuilder('p')
      .addSelect('p.id', 'id')
      .addSelect('p.title', 'title')
      .addSelect('p.shortDescription', 'shortDescription')
      .addSelect('p.content', 'content')
      .addSelect('p.blogId', 'blogId')
      .addSelect('b.name', 'blogName')
      .addSelect('p.createdAt', 'createdAt')
      .addSelect((subQuery) => {
        return subQuery
          .select("COALESCE(s.likeStatus, 'None')", 'myStatus')
          .from('postsLikeStatus', 's')
          .where('s.postId = p.id')
          .andWhere('s.userId = :userId', { userId });
      }, 'myStatus')
      // .addSelect(
      //   `COALESCE((
      //     SELECT s."likeStatus"
      //     FROM "postsLikeStatus" s
      //      WHERE s."postId" = p.id AND s."userId" = :userId
      //      LIMIT 1
      //         ), 'None')`,
      //   'myStatus',
      // )
      .setParameter('userId', userId)
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)')
          .from('postsLikeStatus', 'pls')
          .where('pls.postId = p.id')
          .andWhere("pls.likeStatus = 'Like'");
      }, 'likesCount')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)')
          .from('postsLikeStatus', 'pls')
          .where('pls.postId = p.id')
          .andWhere("pls.likeStatus = 'Dislike'");
      }, 'dislikesCount')
      .addSelect((subQuery) => {
        return subQuery.select(`json_agg(likes)`).from((qb) => {
          return qb
            .select(['pls."createdAt" as "addedAt"', 'pls."userId"', 'u.login'])
            .from('postsLikeStatus', 'pls')
            .innerJoin('users', 'u', 'u.id = pls."userId"')
            .where('pls."postId" = p.id')
            .andWhere(`pls."likeStatus" = 'Like'`)
            .orderBy('pls."createdAt"', 'DESC')
            .limit(3);
        }, 'likes');
      }, 'newestLikes')
      .innerJoin('blogs', 'b', 'b.id = p.blogId')
      .where('p.id = :postId', { postId });

    return await queryBuilder.getRawOne();
  }

  async getPostById(id: string) {
    const query = `SELECT * FROM public.posts WHERE id = $1;`;

    const response = await this.dataSource.query(query, [id]);

    if (response.length === 0) {
      throw new NotFoundException([
        { message: 'Not found post', field: 'postId' },
      ]);
    }

    return await this.mappingsPostsService.formatingDataForOutputPost(
      response[0],
    );
  }

  async findPostById(postId: string): Promise<PostOutputModelDB> {
    return await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });
  }

  async isPostDoesExist(postId: string): Promise<boolean> {
    const queryBuilder = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });

    return !!queryBuilder;
  }

  async getLike(postId: string, userId: string): Promise<boolean> {
    return await this.likesTypeOrmQueryRepository.isLikePostDoesExist(
      postId,
      userId,
    );
  }
}

// const query1 = `
//     WITH result AS (
//       SELECT
//         posts.id,
//         posts.title,
//         posts."shortDescription",
//         posts.content,
//         posts."blogId",
//         blogs.name AS "blogName",
//         posts."createdAt"
//      FROM
//         posts
//      JOIN
//         blogs ON posts."blogId" = blogs.id
//        )
//      SELECT * FROM result
//      ORDER BY "${sortBy}" COLLATE "C" ${sortDirection}
//      LIMIT ${pageSize} OFFSET ${pageSize * (pageNumber - 1)};`;
//
// const query = `SELECT * FROM public.posts ORDER BY "${sortBy}" COLLATE "C" ${sortDirection}
//         LIMIT ${pageSize} OFFSET ${pageSize * (pageNumber - 1)};`;
