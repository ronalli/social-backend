import { Injectable } from '@nestjs/common';
import { PostCreateModel } from '../api/models/input/create-post.input.model';
import { PostsRepository } from '../infrastructure/posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {
  }

  async createPost(post: PostCreateModel, currentUser: string) {
    return await this.postsRepository.create(post, currentUser);
  }

  async updatePost(id: string, post: PostCreateModel) {
    return await this.postsRepository.update(id, post);
  }

  async getPost(id: string, currentUser: string) {
    return await this.postsRepository.findPostById(id, currentUser)
  }

  async deletePost(id: string) {
    return await this.postsRepository.delete(id);
  }

  // async updateLikeStatus(data: Omit<ILikeTypeDB, 'addedAt'>) {
  //
  //   const post = await this.postsRepository.getPost(data.parentId);
  //
  //   if(!post) {
  //     return {
  //       status: ResultCode.NotFound,
  //       data: null,
  //       errorsMessages: [
  //         {
  //           "message": "Not found post",
  //           "field": 'post id'
  //         }
  //       ]
  //     }
  //   }
  //
  //   const searchLike = await this.postsRepository.getLike(data.parentId, data.userId);
  //
  //   if(!searchLike) {
  //     await this.postsRepository.addStatusLike(data)
  //
  //     data.status === LikeStatus.Like
  //       ? post.likesCount += 1
  //       : data.status === 'None'
  //         ? ''
  //         : post.dislikesCount += 1;
  //
  //     await post.save();
  //
  //     return {status: ResultCode.NotContent, data: null}
  //   }
  //   return await this.postsRepository.updateStatusLike(data, post)
  // }
}