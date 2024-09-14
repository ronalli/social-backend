import { ObjectId } from 'mongodb';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
// import { PostsQueryRepository } from './posts.query-repository';
// import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query-repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';
import {
  Like,
  LikeDocument,
  LikeModelType,
  LikeStatus,
} from '../../likes/domain/like.entity';
import { MappingsPostsService } from '../application/mappings/mapping.posts';
import { UpdateLikeStatusPostCommand } from '../application/usecases/update-likeStatus.post.usecase';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    @InjectModel(Like.name) private LikeModel: LikeModelType,
    // private readonly blogsQueryRepository: BlogsQueryRepository,
    // private readonly postsQueryRepository: PostsQueryRepository,
    private readonly mappingsPostsService: MappingsPostsService,
  ) {}

  async create(post: PostDocument, currentUser: string) {
    const insertResult = await this.PostModel.insertMany([post]);

    const foundedPost = await this.getPost(String(insertResult[0]._id));

    if (!foundedPost)
      throw new BadRequestException([
        { message: 'Something went wrong', field: 'post' },
      ]);

    return await this.mappingsPostsService.formatingDataForOutputPost(
      foundedPost,
      currentUser,
      this.LikeModel,
    );
  }

  // async update(id: string, updatePost: PostCreateModel) {
  //
  //   const {content, blogId, shortDescription, title} = updatePost;
  //
  //   try {
  //     const findPost = await this.PostModel.findOne({_id: new ObjectId(id)});
  //     if (findPost) {
  //
  //       findPost.title = title;
  //       findPost.content = content;
  //       findPost.shortDescription = shortDescription;
  //       findPost.blogId = blogId;
  //
  //       await findPost.save();
  //
  //       return {status: ResultCode.NotContent, data: null}
  //     }
  //     return {errorMessage: 'Not found post', status: ResultCode.NotFound, data: null}
  //   } catch (e) {
  //     return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
  //   }
  //
  // }

  async delete(id: string) {
    const findDeletePost = await this.PostModel.findOne({
      _id: new ObjectId(id),
    });

    if (findDeletePost) {
      await this.PostModel.deleteOne({ _id: new ObjectId(id) });
      return true;
    }
    throw new NotFoundException([{ message: 'Not found post', field: 'id' }]);
  }

  async getPost(id: string) {
    return this.PostModel.findOne({ _id: new ObjectId(id) });
  }

  async getLike(postId: string, userId: string) {
    return this.LikeModel.findOne({
      $and: [{ userId: userId }, { parentId: postId }],
    });
  }

  async addStatusLike(like: LikeDocument) {
    try {
      const insertResult = await this.LikeModel.insertMany([like]);
      return insertResult[0].id;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updateStatusLike(
    like: UpdateLikeStatusPostCommand,
    post: PostDocument,
  ) {
    const currentStatus = await this.LikeModel.findOne({
      $and: [{ userId: like.userId }, { parentId: like.parentId }],
    });

    if (!currentStatus) {
      throw new BadRequestException([
        { message: 'If the inputModel has incorrect values', field: 'status' },
      ]);
    }

    if (currentStatus.status === like.status.likeStatus) {
      return true;
    }

    if (like.status.likeStatus === LikeStatus.None) {
      await this.LikeModel.deleteOne({
        $and: [{ userId: like.userId }, { parentId: like.parentId }],
      });

      currentStatus.status === LikeStatus.Like
        ? (post.likesCount -= 1)
        : (post.dislikesCount -= 1);

      await post.save();

      return true;
    }

    if (like.status.likeStatus === LikeStatus.Like) {
      post.likesCount += 1;
      post.dislikesCount -= 1;
    } else {
      post.likesCount -= 1;
      post.dislikesCount += 1;
    }

    currentStatus.status = like.status.likeStatus;

    await post.save();

    await currentStatus.save();

    return true;
  }

  async findPostById(id: string, currentUser: string) {
    try {
      const foundPost = await this.PostModel.findOne({ _id: new ObjectId(id) });
      if (foundPost) {
        return await this.mappingsPostsService.formatingDataForOutputPost(
          foundPost,
          currentUser,
          this.LikeModel,
        );
      }
      return false;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
