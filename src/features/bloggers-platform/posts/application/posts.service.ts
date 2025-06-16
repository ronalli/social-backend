import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { PostQueryDto } from '../api/models/post-query.dto';
import { jwtService } from '../../../../common/services/jwt.service';
import { MappingsPostsService } from './mappings/mapping.posts';
import { PostsTypeOrmRepository } from '../infrastructure/posts.typeorm.repository';
import { PostUpdateSpecialModel } from '../api/models/input/update-post.special.blog.model';
import { PostsTypeOrmQueryRepository } from "../infrastructure/posts.typeorm.query-repository";

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly postTypeOrmRepository: PostsTypeOrmRepository,
    private readonly postTypeOrmQueryRepository: PostsTypeOrmQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly mappingsPostsService: MappingsPostsService,
  ) {}

  async getPost(id: string, currentUser: string) {
    const result = await this.postTypeOrmQueryRepository.getPost(id, currentUser);
    return await this.mappingsPostsService.formatingDataForOutputPost(result);
  }

  // async deletePost(id: string) {
  //   return await this.postTypeOrmRepository.deletePost('blogId',id);
  // }

  async getAllPosts(token: string, query: PostQueryDto) {
    const currentUserId = await jwtService.getUserIdByToken(token);

    const allPosts = await this.postTypeOrmQueryRepository.getPosts(
      query,
      currentUserId,
    );

    const items = await this.mappingsPostsService.formatingAllPostForView(
      allPosts.items,
    );

    return {
      ...allPosts,
      items,
    };
  }

  async updatePostBySpecialBlog(
    post: PostUpdateSpecialModel,
    blogId: string,
    postId: string,
  ): Promise<boolean> {
    return await this.postTypeOrmRepository.updatePost(post, blogId, postId);
  }

  async deletePostBySpecialBlog(blogId: string, postId: string) {
    return await this.postTypeOrmRepository.deletePost(blogId, postId);
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
