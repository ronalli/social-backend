import {
  PostDB,
  PostOutputModel,
  PostOutputModelDB,
} from '../../api/models/output/post.output.model';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/blogs.query-repository';

@Injectable()
export class MappingsPostsService {
  constructor(
    @Inject(forwardRef(() => BlogsQueryRepository))
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async formatingAllPostForView(posts: PostDB[]) {
    const result: PostOutputModel[] = [];
    for (const post of posts) {
      const viewPost = await this.formatingDataForOutputPost(post);
      result.push(viewPost);
    }
    return result;
  }

  async formatingDataForOutputPost(post: PostDB): Promise<PostOutputModel> {
    const {
      id,
      title,
      shortDescription,
      content,
      createdAt,
      blogId,
      blogName,
      myStatus,
      likesCount,
      dislikesCount,
      newestLikes,
    } = post;

    return {
      id,
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      createdAt,
      extendedLikesInfo: {
        likesCount: +likesCount,
        dislikesCount: +dislikesCount,
        myStatus,
        newestLikes: newestLikes || [],
      },
    };
  }

  // async formatingDataForOutputPost(post: PostDocument, user: string | null, LikeModel: LikeModelType): Promise<PostOutputModel> {
  //   const currentStatus = await LikeModel.findOne({
  //     $and: [{parentId: post._id}, {userId: user}]
  //   })
  //
  //   const lastLikes: LikeDocument[] = await LikeModel.find({$and:[{
  //       parentId: post._id
  //     }, {status: 'Like'}]
  //
  //   }).sort({addedAt: -1}).limit(3).select('-parentId -status')
  //
  //   const likesInfo = {
  //     likesCount: post.likesCount,
  //     dislikesCount: post.dislikesCount,
  //     myStatus: currentStatus?.status ? currentStatus.status : 'None',
  //     newestLikes: this.formatViewNewestLikes(lastLikes)
  //   }
  //
  //   return {
  //     id: String(post._id),
  //     blogId: post.blogId,
  //     content: post.content,
  //     createdAt: post.createdAt,
  //     shortDescription: post.shortDescription,
  //     blogName: post.blogName,
  //     title: post.title,
  //     extendedLikesInfo: likesInfo
  //   };
  //
  // }

  // formatViewNewestLikes(data: LikeDocument[]) {
  //   return data.map((d) => {
  //     return {
  //       userId: d.userId,
  //       login: d.login,
  //       addedAt: d.addedAt,
  //     };
  //   });
  // }
}
