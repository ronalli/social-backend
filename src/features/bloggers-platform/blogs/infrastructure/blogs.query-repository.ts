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
    // queryParamsService: QueryParamsService, private readonly mappingsBlogsService: MappingBlogsService, private readonly mappingsPostsService: MappingsPostsService
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
    // const query = this.queryParamsService.createDefaultValues(queryParams);
    //
    // const search = query.searchNameTerm ?
    //   { name: { $regex: `${query.searchNameTerm}`, $options: 'i' } } : {};
    //
    // const filter = {
    //   ...search,
    // };
    //
    // try {
    //
    //   const allBlogs = await this.BlogModel
    //     .find(filter)
    //     .sort({ [query.sortBy]: query.sortDirection })
    //     .skip((query.pageNumber - 1) * query.pageSize)
    //     .limit(query.pageSize);
    //
    //
    //   const totalCount = await this.BlogModel.countDocuments(filter);
    //
    //   return {
    //       pagesCount: Math.ceil(totalCount / query.pageSize),
    //       page: query.pageNumber,
    //       pageSize: query.pageSize,
    //       totalCount,
    //       items: allBlogs.map(x => this.mappingsBlogsService.formatingDataForOutputBlog(x)),
    //   };
    // } catch (e) {
    //   throw new InternalServerErrorException([{message: 'Error DB', field: 'DB'}])
    // }
  }

  async findBlogById(blogId: string) {
    const query = `SELECT * FROM public."blogs" WHERE id = $1;`;
    const result = await this.dataSource.query(query, [blogId]);
    return result[0];
  }

  async blogIsExist(blogId: string) {
    // return !!(await this.BlogModel.countDocuments({_id: new ObjectId(blogId)}))
    // return this.BlogModel.findOne({ _id: new ObjectId(blogId) });
  }
}
