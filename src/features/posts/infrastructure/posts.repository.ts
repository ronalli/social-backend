import {ObjectId} from "mongodb";
import { Injectable } from '@nestjs/common';
import { PostsQueryRepository } from './posts.query-repository';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query-repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../domain/post.entity';
import { PostCreateModel } from '../api/models/input/create-post.input.model';
import { ResultCode } from '../../../settings/http.status';
import { Like, LikeModelType } from '../../likes/domain/like.entity';
import { Types } from 'mongoose';
import { MappingsPostsService } from '../application/mappings/mapping.posts';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType, @InjectModel(Like.name) private LikeModel: LikeModelType, private readonly blogsQueryRepository: BlogsQueryRepository, private readonly postsQueryRepository: PostsQueryRepository, private readonly mappingsPostsService: MappingsPostsService) {
  }

  async create(postData: PostCreateModel, currentUser: string) {
    const findBlog = await this.blogsQueryRepository.findBlogById(postData.blogId);

    if (findBlog.data) {

      const post = new this.PostModel({
        ...postData,
        _id: new Types.ObjectId(),
        blogName: findBlog.data.name,
        createdAt: new Date().toISOString(),
        dislikesCount: 0,
        likesCount: 0
      });
      const response = await post.save();

      try {
        const foundPost = await this.PostModel.findOne({_id: response._id});
        if (foundPost) {
          return {
            status: ResultCode.Created,
            data: await this.mappingsPostsService.formatingDataForOutputPost(foundPost, currentUser, this.LikeModel)
          }
        }
        return {errorMessage: 'Something went wrong', status: ResultCode.BadRequest, data: null}
      } catch (e) {
        return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
      }
    }
    return {errorMessage: 'Not found blog', status: ResultCode.NotFound}
  }

  async update(id: string, updatePost: PostCreateModel) {

    const {content, blogId, shortDescription, title} = updatePost;

    try {
      const findPost = await this.PostModel.findOne({_id: new ObjectId(id)});
      if (findPost) {

        findPost.title = title;
        findPost.content = content;
        findPost.shortDescription = shortDescription;
        findPost.blogId = blogId;

        await findPost.save();

        return {status: ResultCode.NotContent, data: null}
      }
      return {errorMessage: 'Not found post', status: ResultCode.NotFound, data: null}
    } catch (e) {
      return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
    }

  }

  async delete(id: string) {

    const findDeletePost = await this.PostModel.findOne({_id: new ObjectId(id)});

    if (findDeletePost) {
      await this.PostModel.deleteOne({_id: new ObjectId(id)});
      return {status: ResultCode.NotContent, data: null}
    }
    return {errorMessage: 'Not found post', status: ResultCode.NotFound, data: null}
  }

  async getPost(id: string) {
    return this.PostModel.findOne({_id: id});
  }

  // async getLike(postId: string, userId: string) {
  //   return LikeModel.findOne({
  //     $and: [{userId: userId}, {parentId: postId}]
  //   })
  // }

  // async addStatusLike(data: Omit<ILikeTypeDB, 'addedAt'>) {
  //
  //   const like = new LikeModel({});
  //
  //   like.userId = data.userId;
  //   like.parentId = data.parentId;
  //   like.status = data.status;
  //   like.addedAt = new Date().toISOString();
  //   like.login = data.login;
  //
  //   await like.save();
  //
  //   return like;
  //
  // }

  // async updateStatusLike(data: Omit<ILikeTypeDB, 'addedAt'>, post: PostDocument) {
  //
  //   const currentStatus = await LikeModel.findOne(({
  //     $and: [{userId: data.userId}, {parentId: data.parentId}]
  //   }))
  //
  //   if (!currentStatus) {
  //     return {
  //       status: ResultCode.BadRequest, data: null, errorsMessages: [
  //         {
  //           "message": "Wrong",
  //           "field": 'status'
  //         }
  //       ]
  //     }
  //   }
  //
  //   if (currentStatus.status === data.status) {
  //     return {status: ResultCode.NotContent, data: null}
  //   }
  //
  //
  //   if (data.status === LikeStatus.Like) {
  //     post.likesCount += 1;
  //     post.dislikesCount -= 1;
  //   } else if (data.status === LikeStatus.Dislike) {
  //     post.likesCount -= 1;
  //     post.dislikesCount += 1;
  //   } else {
  //     currentStatus.status === LikeStatus.Like ? post.likesCount -= 1 : post.dislikesCount -= 1;
  //   }
  //   currentStatus.status = data.status;
  //
  //   await post.save();
  //
  //   await currentStatus.save();
  //
  //   return {status: ResultCode.NotContent, data: null}
  // }

  async findPostById(id: string, currentUser: string) {
    try {
      const foundPost = await this.PostModel.findOne({_id: new ObjectId(id)});
      if (foundPost) {
        return {
          status: ResultCode.Success,
          data: await this.mappingsPostsService.formatingDataForOutputPost(foundPost, currentUser, this.LikeModel)
        }
      }
      return {errorMessage: 'Not found post', status: ResultCode.NotFound, data: null}
    } catch (e) {
      return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
    }
  }
}