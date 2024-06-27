import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { MappingBlogsService } from '../application/mappings/mapping.blogs';
import { ResultCode } from '../../../settings/http.status';
import { Injectable } from '@nestjs/common';
import { Post, PostModelType } from '../../posts/domain/post.entity';
import { MappingsPostsService } from '../../posts/application/mappings/mapping.posts';
import { Like, LikeModelType } from '../../likes/domain/like.entity';
import { BlogQueryDto } from '../api/models/blog-query.dto';
import { QueryParamsService } from '../../../common/utils/create.default.values';

@Injectable()
export class BlogsQueryRepository {

  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType, @InjectModel(Post.name) private PostModel: PostModelType, @InjectModel(Like.name) private LikeModel: LikeModelType, private readonly queryParamsService: QueryParamsService, private readonly mappingsBlogsService: MappingBlogsService, private readonly mappingsPostsService: MappingsPostsService) {
  }

  async getAndSortPostsSpecialBlog(blogId: string, queryParams: BlogQueryDto, currentUser: string | null) {
    const query = this.queryParamsService.createDefaultValues(queryParams);

    const search = query.searchNameTerm ?
      { title: { $regex: query.searchNameTerm, $options: 'i' } } : {};

    const filter = {
      blogId,
      ...search,
    };

    try {
      const allPosts = await this.PostModel
        .find(filter)
        .sort({ [query.sortBy]: query.sortDirection })
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(query.pageSize);


      const totalCount = await this.PostModel.countDocuments(filter);

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

  async getAllBlogs(queryParams: BlogQueryDto) {
    const query = this.queryParamsService.createDefaultValues(queryParams);

    const search = query.searchNameTerm ?
      { name: { $regex: `${query.searchNameTerm}`, $options: 'i' } } : {};

    const filter = {
      ...search,
    };

    try {

      const allBlogs = await this.BlogModel
        .find(filter)
        .sort({ [query.sortBy]: query.sortDirection })
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(query.pageSize);


      const totalCount = await this.BlogModel.countDocuments(filter);

      return {
        status: ResultCode.Success,
        data: {
          pagesCount: Math.ceil(totalCount / query.pageSize),
          page: query.pageNumber,
          pageSize: query.pageSize,
          totalCount,
          items: allBlogs.map(x => this.mappingsBlogsService.formatingDataForOutputBlog(x)),
        },
      };
    } catch (e) {
      return { errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null };
    }
  }

  async findBlogById(blogId: string) {
    try {
      const foundBlog = await this.BlogModel.findOne({ _id: new ObjectId(blogId) });
      if (foundBlog) {

        return {
          status: ResultCode.Success,
          data: this.mappingsBlogsService.formatingDataForOutputBlog(foundBlog),
        };
      }
      return { errorMessage: 'Not found blog', status: ResultCode.NotFound, data: null };
    } catch (e) {
      return { errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null };
    }

  }
}
