import {ObjectId} from "mongodb";
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { mappingBlogs } from '../../../common/mapping.blogs';
import { IBlogQueryType } from '../api/models/all.types';
import { ResultCode } from '../../../settings/http.status';
import { createDefaultValues } from '../../../common/create.default.values';
import { Injectable } from '@nestjs/common';
import { Post, PostModelType } from '../../posts/domain/post.entity';
import { mappingPosts } from '../../../common/mapping.posts';
import { Like, LikeModelType } from '../../likes/domain/like.entity';

@Injectable()
export class BlogsQueryRepository {

  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType, @InjectModel(Post.name) private PostModel: PostModelType, @InjectModel(Like.name) private LikeModel: LikeModelType ) {
  }

  async getAndSortPostsSpecialBlog(blogId: string, queryParams: IBlogQueryType, currentUser: string | null) {
    const query = createDefaultValues(queryParams);

    const search = query.searchNameTerm ?
      {title: {$regex: query.searchNameTerm, $options: "i"}} : {}

    const filter = {
      blogId,
      ...search
    }

    try {
      const allPosts = await this.PostModel
        .find(filter)
        .sort({[query.sortBy]: query.sortDirection})
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(query.pageSize)


      const totalCount = await this.PostModel.countDocuments(filter);

      return {
        status: ResultCode.Success,
        data: {
          pagesCount: Math.ceil(totalCount / query.pageSize),
          page: query.pageNumber,
          pageSize: query.pageSize,
          totalCount,
          items: await mappingPosts.formatingAllPostForView(allPosts, currentUser, this.LikeModel)
        }
      }

    } catch (e) {
      return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
    }
  }
  async getAllBlogs(queryParams: IBlogQueryType){
    const query = createDefaultValues(queryParams);

    const search = query.searchNameTerm ?
      {name: {$regex: `${query.searchNameTerm}`, $options: "i"}} : {}

    const filter = {
      ...search
    }

    try {

      const allBlogs = await this.BlogModel
        .find(filter)
        .sort({[query.sortBy]: query.sortDirection})
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(query.pageSize)


      const totalCount = await this.BlogModel.countDocuments(filter);

      return {
        status: ResultCode.Success,
        data: {
          pagesCount: Math.ceil(totalCount / query.pageSize),
          page: query.pageNumber,
          pageSize: query.pageSize,
          totalCount,
          items: allBlogs.map(x => mappingBlogs.formatingDataForOutputBlog(x))
        }
      }
    } catch (e) {
      return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
    }
  }
  async findBlogById(blogId: string){
    try {
      const foundBlog = await this.BlogModel.findOne({_id: new ObjectId(blogId)});
      if (foundBlog) {

        return {
          status: ResultCode.Success,
          data: mappingBlogs.formatingDataForOutputBlog(foundBlog)
        }
      }
      return {errorMessage: 'Not found blog', status: ResultCode.NotFound, data: null}
    } catch (e) {
      return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
    }

  }
}
