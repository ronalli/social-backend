import { Injectable, NotFoundException } from '@nestjs/common';
import { PostQueryDto } from '../api/models/post-query.dto';
import { MappingsPostsService } from '../application/mappings/mapping.posts';
import { QueryParamsService } from '../../../../common/utils/create.default.values';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  PostDB,
  PostOutputModelDB,
} from '../api/models/output/post.output.model';
import { createOrderByClause } from '../../../../common/utils/orderByClause';
import { Post } from '../domain/post.entity';

@Injectable()
export class PostsTypeOrmQueryRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly queryParamsService: QueryParamsService,
    private readonly mappingsPostsService: MappingsPostsService,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  // async getPosts(queryParams: PostQueryDto, userId: string) {
  //   const defaultQueryParams =
  //     this.queryParamsService.createDefaultValues(queryParams);
  //
  //   const { pageNumber, pageSize, sortBy, sortDirection } = defaultQueryParams;
  //
  //   const orderByClause = createOrderByClause(sortBy, sortDirection);
  //
  //   const query = `
  //   WITH result AS (
  //     SELECT
  //       p.id,
  //       p.title,
  //       p."shortDescription",
  //       p.content,
  //       p."blogId",
  //       b.name AS "blogName",
  //       p."createdAt",
  //       COALESCE(s."likeStatus", 'None') AS "myStatus",
  //       (SELECT COUNT(*) FROM public."postsLikeStatus" WHERE "postId" = p.id AND "likeStatus" = 'Like') AS "likesCount",
  //       (SELECT COUNT(*) FROM public."postsLikeStatus" WHERE "postId" = p.id AND "likeStatus" = 'Dislike') AS "dislikesCount",
  //    (
  //      SELECT json_agg(likes)
  //      FROM (
  //        SELECT
  //           pls."userId",
  //           u.login,
  //           pls."createdAt" as "addedAt"
  //        FROM public."postsLikeStatus" pls
  //        JOIN public.users u ON u.id = pls."userId"
  //        WHERE pls."postId" = p.id AND pls."likeStatus" = 'Like'
  //        ORDER BY pls."createdAt"::TIMESTAMP DESC
  //        LIMIT 3
  //        ) likes
  //      ) as "newestLikes"
  //    FROM posts p
  //    JOIN blogs b ON p."blogId" = b.id
  //    LEFT JOIN public."postsLikeStatus" s ON s."postId" = p.id AND s."userId" = $1
  //      )
  //    SELECT * FROM result
  //    ORDER BY ${orderByClause}
  //    LIMIT ${pageSize} OFFSET ${pageSize * (pageNumber - 1)};`;
  //
  //   // const query = `SELECT * FROM public.posts ORDER BY "${sortBy}" COLLATE "C" ${sortDirection}
  //   //     LIMIT ${pageSize} OFFSET ${pageSize * (pageNumber - 1)};`;
  //
  //   const response = await this.dataSource.query(query, [userId]);
  //
  //   const totalQuery = `SELECT * FROM public.posts;`;
  //
  //   const totalCount = await this.dataSource.query(totalQuery, []);
  //
  //   return {
  //     pagesCount: +Math.ceil(totalCount.length / pageSize),
  //     page: +pageNumber,
  //     pageSize: +pageSize,
  //     totalCount: +totalCount.length,
  //     items: response,
  //   };
  // }

  async getPost(postId: string, userId: string): Promise<PostDB> {
    const query = `
      SELECT 
        p.id,
        p.title,
        p."shortDescription",
        p.content,
        p."blogId",
        b.name AS "blogName",
        p."createdAt",
        COALESCE(s."likeStatus", 'None') AS "myStatus",
        (SELECT COUNT(*) FROM public."postsLikeStatus" WHERE "postId" = p.id AND "likeStatus" = 'Like') AS "likesCount",
        (SELECT COUNT(*) FROM public."postsLikeStatus" WHERE "postId" = p.id AND "likeStatus" = 'Dislike') AS "dislikesCount",
        (
       SELECT json_agg(likes)
       FROM (
         SELECT
            pls."createdAt" as "addedAt",
            pls."userId",
            u.login
         FROM public."postsLikeStatus" pls
         JOIN public.users u ON u.id = pls."userId"
         WHERE pls."postId" = p.id AND pls."likeStatus" = 'Like'
         ORDER BY pls."createdAt"::TIMESTAMP DESC
         LIMIT 3  
         ) likes
       ) as "newestLikes"
        FROM public.posts p
        JOIN public.blogs b ON b.id = p."blogId"
        LEFT JOIN public."postsLikeStatus" s ON s."postId" = p.id AND s."userId" = $1
        WHERE p.id = $2;
    `;

    const response = await this.dataSource.query(query, [userId, postId]);

    return response[0];
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
    const query = `SELECT * FROM public.posts WHERE id = $1;`;

    const response = await this.dataSource.query(query, [postId]);

    return response[0];
  }

  async isPostDoesExist(postId: string): Promise<boolean> {
    const query = `SELECT * FROM public.posts WHERE id = $1;`;

    const result = await this.dataSource.query(query, [postId]);

    return result.length > 0;
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
