import { MappingBlogsService } from '../application/mappings/mapping.blogs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MappingsPostsService } from '../../posts/application/mappings/mapping.posts';
import { QueryParamsService } from '../../../../common/utils/create.default.values';
import { BlogQueryDto } from '../api/models/blog-query.dto';
import { ResultCode } from '../../../../settings/http.status';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    public queryParamsService: QueryParamsService,
    // private readonly mappingsBlogsService: MappingBlogsService, private readonly mappingsPostsService: MappingsPostsService
  ) {}

  async getAndSortPostsSpecialBlog(
    blogId: string,
    queryParams: BlogQueryDto,
    currentUser: string | null,
  ) {
    // const query = this.queryParamsService.createDefaultValues(queryParams);
    //
    // const search = query.searchNameTerm ?
    //   { title: { $regex: query.searchNameTerm, $options: 'i' } } : {};
    //
    // const filter = {
    //   blogId,
    //   ...search,
    // };
    //
    // try {
    //   const allPosts = await this.PostModel
    //     .find(filter)
    //     .sort({ [query.sortBy]: query.sortDirection })
    //     .skip((query.pageNumber - 1) * query.pageSize)
    //     .limit(query.pageSize);
    //
    //
    //   const totalCount = await this.PostModel.countDocuments(filter);
    //
    //   return {
    //     status: ResultCode.Success,
    //     data: {
    //       pagesCount: Math.ceil(totalCount / query.pageSize),
    //       page: query.pageNumber,
    //       pageSize: query.pageSize,
    //       totalCount,
    //       items: await this.mappingsPostsService.formatingAllPostForView(allPosts, currentUser, this.LikeModel),
    //     },
    //   };
    //
    // } catch (e) {
    //   throw new InternalServerErrorException(e)
    // }
  }

  async getAllBlogs(queryParams: BlogQueryDto) {

    const defaultQueryParams = this.queryParamsService.createDefaultValues(queryParams);

    const {
      searchNameTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize
    } = defaultQueryParams;


    const namePattern = searchNameTerm ? `%${searchNameTerm}%` : null;

    const totalCountQuery = `SELECT * FROM public.blogs WHERE ($1::text IS NULL)
        OR (name ILIKE COALESCE($1::text, '%'));`;

    const totalCount = await this.dataSource.query(totalCountQuery, [namePattern]);

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
      items: result
    }
  }

  async findBlogById(blogId: string) {
    const query = `SELECT * FROM public."blogs" WHERE id = $1;`;
    const result = await this.dataSource.query(query, [blogId]);
    return result[0];
  }

  async blogIsExist(blogId: string) {

    const query = `SELECT * FROM public."blogs" WHERE id = $1;`;
    const result = await this.dataSource.query(query, [blogId]);

    return !!result[0]

    // return !!(await this.BlogModel.countDocuments({_id: new ObjectId(blogId)}))
    // return this.BlogModel.findOne({ _id: new ObjectId(blogId) });
  }
}
