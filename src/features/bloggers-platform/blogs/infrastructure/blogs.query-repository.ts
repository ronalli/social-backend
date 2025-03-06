import {
  Injectable,
} from '@nestjs/common';
import { MappingsPostsService } from '../../posts/application/mappings/mapping.posts';
import { QueryParamsService } from '../../../../common/utils/create.default.values';
import { BlogQueryDto } from '../api/models/blog-query.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogOutputModel } from '../api/models/output/blog.output.model';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    public queryParamsService: QueryParamsService,
    // private readonly mappingsBlogsService: MappingBlogsService,
    private readonly mappingsPostsService: MappingsPostsService,
  ) {}

  async getAndSortPostsSpecialBlog(
    blogId: string,
    queryParams: BlogQueryDto,
    userId: string,
  ) {
    const defaultQueryParams =
      this.queryParamsService.createDefaultValuesQueryParams(queryParams);

    const { sortBy, sortDirection, pageNumber, pageSize } = defaultQueryParams;

    const totalCountQuery = `SELECT * FROM public.posts WHERE "blogId" = $1;`

    const totalCount = await this.dataSource.query(totalCountQuery, [blogId]);

    const pagesCount = Math.ceil(totalCount.length / pageSize);

    const values = userId !== 'None' ? [blogId, userId] : [blogId]

    const query1 = `
    WITH result AS (
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
            pls."userId",
            u.login,
            pls."createdAt" as "addedAt"
         FROM public."postsLikeStatus" pls
         JOIN public.users u ON u.id = pls."userId"
         WHERE pls."postId" = p.id AND pls."likeStatus" = 'Like'
         ORDER BY pls."createdAt"::TIMESTAMP DESC
         LIMIT 3  
         ) likes
       ) as "newestLikes"
     FROM posts p
     JOIN blogs b ON p."blogId" = b.id
     LEFT JOIN public."postsLikeStatus" s ON s."postId" = p.id ${userId !== "None" ? `AND s."userId" = $2` : ``} 
       )
     SELECT * FROM result
     WHERE "blogId" = $1
     ORDER BY "${sortBy}" COLLATE "C" ${sortDirection}
     LIMIT ${pageSize} OFFSET ${pageSize * (pageNumber - 1)};`;

    const result = await this.dataSource.query(query1, values);

    const items = await this.mappingsPostsService.formatingAllPostForView(result)

    return {
      pagesCount: +pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount.length,
      items,
    }
  }

  async getAllBlogs(queryParams: BlogQueryDto) {
    const defaultQueryParams =
      this.queryParamsService.createDefaultValues(queryParams);

    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      defaultQueryParams;

    const namePattern = searchNameTerm ? `%${searchNameTerm}%` : null;

    const totalCountQuery = `SELECT * FROM public.blogs WHERE ($1::text IS NULL)
        OR (name ILIKE COALESCE($1::text, '%'));`;

    const totalCount = await this.dataSource.query(totalCountQuery, [
      namePattern,
    ]);

    const pagesCount = Math.ceil(totalCount.length / pageSize);

    const query = `
    SELECT * FROM public.blogs WHERE ($1::text IS NULL)
        OR (name ILIKE COALESCE($1::text, '%'))
        ORDER BY "${sortBy}" COLLATE "C" ${sortDirection}
        LIMIT ${pageSize} OFFSET ${pageSize * (pageNumber - 1)};
        `;

    const result = await this.dataSource.query(query, [namePattern]);

    return {
      pagesCount: +pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount.length,
      items: result,
    };
  }

  async findBlogById(blogId: string): Promise<BlogOutputModel> {
    const query = `SELECT * FROM public."blogs" WHERE id = $1;`;
    const result = await this.dataSource.query(query, [blogId]);


    return result[0];
  }

  async blogIsExist(blogId: string) {
    const query = `SELECT * FROM public."blogs" WHERE id = $1;`;
    const result = await this.dataSource.query(query, [blogId]);

    return !!result[0];
  }
}
