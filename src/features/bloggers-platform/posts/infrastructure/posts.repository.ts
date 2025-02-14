import { ObjectId } from 'mongodb';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
// import { PostsQueryRepository } from './posts.query-repository';
// import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query-repository';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';

import { MappingsPostsService } from '../application/mappings/mapping.posts';
import { UpdateLikeStatusPostCommand } from '../application/usecases/update-likeStatus.post.usecase';
import { Like, LikeDocument, LikeModelType, LikeStatus } from '../../../likes/domain/like.entity';
import { PostCreateDBModel } from '../../blogs/api/models/input/create-blog.db.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsRepository {
  constructor(
    // @InjectModel(Post.name) private PostModel: PostModelType,
    // @InjectModel(Like.name) private LikeModel: LikeModelType,
    // private readonly blogsQueryRepository: BlogsQueryRepository,
    // private readonly postsQueryRepository: PostsQueryRepository,
    @InjectDataSource() protected dataSource: DataSource,
    private readonly mappingsPostsService: MappingsPostsService,
  ) {}

  async create(post: PostCreateDBModel, currentUser: string) {

    const {id, title, shortDescription, content,blogId, createdAt, } = post;

    const query = `INSERT INTO public.posts (id, title, "shortDescription", content, "createdAt", "blogId") VALUES($1, $2, $3, $4, $5, $6) RETURNING *;`;

    const result = await this.dataSource.query(query, [
      id, title, shortDescription, content, createdAt, blogId
    ]);

    return result[0].id;

    // const insertResult = await this.PostModel.insertMany([post]);
    //
    // const foundedPost = await this.getPost(String(insertResult[0]._id));
    //
    // if (!foundedPost)
    //   throw new BadRequestException([
    //     { message: 'Something went wrong', field: 'post' },
    //   ]);
    //
    // return await this.mappingsPostsService.formatingDataForOutputPost(
    //   foundedPost,
    //   currentUser,
    //   this.LikeModel,
    // );
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
    // const findDeletePost = await this.PostModel.findOne({
    //   _id: new ObjectId(id),
    // });
    //
    // if (findDeletePost) {
    //   await this.PostModel.deleteOne({ _id: new ObjectId(id) });
    //   return true;
    // }
    // throw new NotFoundException([{ message: 'Not found post', field: 'id' }]);
  }

  async findPostById(id: string, currentUser: string) {

    const query = `SELECT * FROM public.posts WHERE id = $1;`;

    const result = await this.dataSource.query(query, [id]);

    return result[0]

  }

  async getPost(id: string) {
    // return this.PostModel.findOne({ _id: new ObjectId(id) });
  }

  async getLike(postId: string, userId: string) {
    const query = `SELECT * FROM public."postsLikeStatus" WHERE "postId" = $1 AND "userId" = $2;`

    return await this.dataSource.query(query, [postId, userId])

    // return result
  }

  async addStatusLike(like: LikeDocument) {
    // try {
    //   const insertResult = await this.LikeModel.insertMany([like]);
    //   return insertResult[0].id;
    // } catch (e) {
    //   throw new InternalServerErrorException(e);
    // }
  }

  async updateStatusLike(
    like: UpdateLikeStatusPostCommand,
    post: PostDocument,
  ) {
  //   const currentStatus = await this.LikeModel.findOne({
  //     $and: [{ userId: like.userId }, { parentId: like.parentId }],
  //   });
  //
  //   if (!currentStatus) {
  //     throw new BadRequestException([
  //       { message: 'If the inputModel has incorrect values', field: 'status' },
  //     ]);
  //   }
  //
  //   if (currentStatus.status === like.status.likeStatus) {
  //     return true;
  //   }
  //
  //   if (like.status.likeStatus === LikeStatus.None) {
  //     await this.LikeModel.deleteOne({
  //       $and: [{ userId: like.userId }, { parentId: like.parentId }],
  //     });
  //
  //     currentStatus.status === LikeStatus.Like
  //       ? (post.likesCount -= 1)
  //       : (post.dislikesCount -= 1);
  //
  //     await post.save();
  //
  //     return true;
  //   }
  //
  //   if (like.status.likeStatus === LikeStatus.Like) {
  //     post.likesCount += 1;
  //     post.dislikesCount -= 1;
  //   } else {
  //     post.likesCount -= 1;
  //     post.dislikesCount += 1;
  //   }
  //
  //   currentStatus.status = like.status.likeStatus;
  //
  //   await post.save();
  //
  //   await currentStatus.save();
  //
  //   return true;
  }

  // async findPostById(id: string, currentUser: string) {
    // try {
    //   const foundPost = await this.PostModel.findOne({ _id: new ObjectId(id) });
    //   if (foundPost) {
    //     return await this.mappingsPostsService.formatingDataForOutputPost(
    //       foundPost,
    //       currentUser,
    //       this.LikeModel,
    //     );
    //   }
    //   return false;
    // } catch (e) {
    //   throw new InternalServerErrorException(e);
    // }
  // }
}
