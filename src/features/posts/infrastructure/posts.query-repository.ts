import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../domain/post.entity';
import { ResultCode } from '../../../settings/http.status';
import { createDefaultValues } from '../../../common/create.default.values';
import { mappingPosts } from '../../../common/mapping.posts';
import { Like, LikeModelType } from '../../likes/domain/like.entity';
import { QueryParamsDto } from '../../../common/query-params.dto';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType, @InjectModel(Like.name) private LikeModel: LikeModelType) {
  }

  async getPosts(queryParams: QueryParamsDto, currentUser: string | null) {
    const query = createDefaultValues(queryParams);
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
          items: await mappingPosts.formatingAllPostForView(allPosts, currentUser, this.LikeModel),
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