import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostQueryDto } from '../api/models/post-query.dto';
import { MappingsPostsService } from '../application/mappings/mapping.posts';
import { QueryParamsService } from '../../../../common/utils/create.default.values';
import { ResultCode } from '../../../../settings/http.status';

@Injectable()
export class PostsQueryRepository {
  constructor(private readonly queryParamsService: QueryParamsService, private readonly mappingsPostsService: MappingsPostsService) {
  }

  async getPosts(queryParams: PostQueryDto, currentUser: string | null) {
    // const query = this.queryParamsService.createDefaultValues(queryParams);
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
  //   try {
  //     const foundPost = await this.PostModel.findOne({ _id: new ObjectId(id) });
  //     if (foundPost) {
  //       return foundPost;
  //     }
  //     else {
  //       return false;
  //     }
  //   } catch (e) {
  //     throw new InternalServerErrorException(e)
  //   }
  }
}