import { PostDocument } from '../features/posts/domain/post.entity';
import { PostOutputModel } from '../features/posts/api/models/output/post.output.model';
import { LikeDocument, LikeModelType } from '../features/likes/domain/like.entity';

export const mappingPosts = {
  async formatingAllPostForView(posts: PostDocument[], user: string | null, LikeModel: LikeModelType) {

    const result: PostOutputModel[] = [];

    for(const post of posts) {

      const viewPost = await mappingPosts.formatingDataForOutputPost(post, user, LikeModel)

      result.push(viewPost);
    }

    return result;
  },

  async formatingDataForOutputPost(post: PostDocument, user: string | null, LikeModel: LikeModelType): Promise<PostOutputModel> {
    const currentStatus = await LikeModel.findOne({
      $and: [{parentId: post._id}, {userId: user}]
    })

    const lastLikes: LikeDocument[] = await LikeModel.find({$and:[{
        parentId: post._id
      }, {status: 'Like'}]

    }).sort({addedAt: -1}).limit(3).select('-parentId -status')

    const likesInfo = {
      likesCount: post.likesCount,
      dislikesCount: post.dislikesCount,
      myStatus: currentStatus?.status ? currentStatus.status : 'None',
      newestLikes: mappingPosts.formatViewNewestLikes(lastLikes)
    }

    return {
      id: String(post._id),
      blogId: post.blogId,
      content: post.content,
      createdAt: post.createdAt,
      shortDescription: post.shortDescription,
      blogName: post.blogName,
      title: post.title,
      extendedLikesInfo: likesInfo
    };

  },

  formatViewNewestLikes(data: LikeDocument[]) {
    return data.map(d=> {
      return {
        userId: d.userId,
        login: d.login,
        addedAt: d.addedAt
      }
    })
  }
}