import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostQueryDto } from '../api/models/post-query.dto';
import { MappingsPostsService } from '../application/mappings/mapping.posts';
import { QueryParamsService } from '../../../../common/utils/create.default.values';
import { ResultCode } from '../../../../settings/http.status';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsQueryRepository {
  constructor(
    private readonly queryParamsService: QueryParamsService,
    private readonly mappingsPostsService: MappingsPostsService,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async getPosts(queryParams: PostQueryDto, currentUser: string | null) {
    const defaultQueryParams =
      this.queryParamsService.createDefaultValues(queryParams);

    const { searchNameTerm } = defaultQueryParams;

    // try {
    //   const allPosts = await this.PostModel.find()
    //     .sort({ [query.sortBy]: query.sortDirection })
    //     .skip((query.pageNumber - 1) * query.pageSize)
    //     .limit(query.pageSize);
    //
    //   const totalCount = await this.PostModel.countDocuments();
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

  async getPostById(id: string) {
    const query = `SELECT * FROM public.posts WHERE id = $1;`;

    const response = await this.dataSource.query(query, [id]);

    return  await this.mappingsPostsService.formatingDataForOutputPost(response[0])
  }
}
