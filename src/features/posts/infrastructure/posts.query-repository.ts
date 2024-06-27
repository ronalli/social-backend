import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../domain/post.entity';
import { ResultCode } from '../../../settings/http.status';
import { Like, LikeModelType } from '../../likes/domain/like.entity';
import { PostQueryDto } from '../api/models/post-query.dto';
import { QueryParamsService } from '../../../common/utils/create.default.values';
import { MappingsPostsService } from '../application/mappings/mapping.posts';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType, @InjectModel(Like.name) private LikeModel: LikeModelType, private readonly queryParamsService: QueryParamsService, private readonly mappingsPostsService: MappingsPostsService) {
  }

  async getPosts(queryParams: PostQueryDto, currentUser: string | null) {
    const query = this.queryParamsService.createDefaultValues(queryParams);
    try {
      const allPosts = await this.PostModel.find()
        .sort({ [query.sortBy]: query.sortDirection })
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(query.pageSize);

      const totalCount = await this.PostModel.countDocuments();

      return {
        status: ResultCode.Success,
        data: {
          pagesCount: Math.ceil(totalCount / query.pageSize),
          page: query.pageNumber,
          pageSize: query.pageSize,
          totalCount,
          items: await this.mappingsPostsService.formatingAllPostForView(allPosts, currentUser, this.LikeModel),
        },
      };

    } catch (e) {
      return { errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null };
    }
  }

  async getPostById(id: string) {
    try {
      const foundPost = await this.PostModel.findOne({ _id: new ObjectId(id) });
      if (foundPost) {
        return {
          status: ResultCode.Success,
          data: foundPost,
        };
      }
      return { errorMessage: 'Not found post', status: ResultCode.NotFound, data: null };
    } catch (e) {
      return { errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null };
    }
  }
}