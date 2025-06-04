import { Injectable } from '@nestjs/common';

import { PostCreateDBModel } from '../../blogs/api/models/input/create-blog.db.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Post } from '../domain/post.entity';
import { PostUpdateSpecialModel } from '../api/models/input/update-post.special.blog.model';

@Injectable()
export class PostsTypeOrmRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async create(post: PostCreateDBModel, currentUser: string) {
    const postCreated = this.postRepository.create(post);

    const result = await this.postRepository.save(postCreated);

    return result.id;

    // const { id, title, shortDescription, content, blogId, createdAt } = post;
    //
    // const query = `INSERT INTO public.posts (id, title, "shortDescription", content, "createdAt", "blogId") VALUES($1, $2, $3, $4, $5, $6) RETURNING *;`;
    //
    // const result = await this.dataSource.query(query, [
    //   id,
    //   title,
    //   shortDescription,
    //   content,
    //   createdAt,
    //   blogId,
    // ]);
    //
    // return result[0].id;
  }

  async deletePost(blogId: string, postId: string): Promise<boolean> {
    const result = await this.postRepository.delete({
      id: postId,
      blogId: blogId,
    });

    return result.affected > 0;
  }

  async updatePost(
    post: PostUpdateSpecialModel,
    blogId: string,
    postId: string,
  ): Promise<boolean> {
    const result = await this.postRepository.update(
      {
        id: postId,
        blogId: blogId,
      },
      {
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
      },
    );

    return result.affected > 0;
  }

  // async updateCurrentPost(post: any) {
  //   const query = `UPDATE public.posts SET title = $1, "shortDescription" = $2, content = $3, "blogId" = $4 WHERE id = $5 RETURNING *;`;
  //
  //   const values = [
  //     post.title,
  //     post.shortDescription,
  //     post.content,
  //     post.blogId,
  //     post.id,
  //   ];
  //
  //   const response = await this.dataSource.query(query, values);
  //
  //   return response[0];
  // }

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

  // async delete(id: string): Promise<boolean> {
  //   const query = `DELETE FROM public.posts WHERE id = $1 RETURNING *;`;
  //
  //   const result = await this.dataSource.query(query, [id]);
  //
  //   return result[1] === 1;
  // }
  //
  // async findPostById(id: string, currentUser: string) {
  //   const query = `SELECT * FROM public.posts WHERE id = $1;`;
  //
  //   const result = await this.dataSource.query(query, [id]);
  //
  //   return result[0];
  // }
  //
  // async getLike(postId: string, userId: string): Promise<boolean> {
  //   const query = `SELECT * FROM public."postsLikeStatus" WHERE "postId" = $1 AND "userId" = $2;`;
  //
  //   const result = await this.dataSource.query(query, [postId, userId]);
  //
  //   return result.length > 0;
  // }

  // async addStatusLike(like: LikeDocument) {
  //   // try {
  //   //   const insertResult = await this.LikeModel.insertMany([like]);
  //   //   return insertResult[0].id;
  //   // } catch (e) {
  //   //   throw new InternalServerErrorException(e);
  //   // }
  // }

  // async updateStatusLike(
  //   like: UpdateLikeStatusPostCommand,
  //   // post: PostDocument,
  // ) {
  // //   const currentStatus = await this.LikeModel.findOne({
  // //     $and: [{ userId: like.userId }, { parentId: like.parentId }],
  // //   });
  // //
  // //   if (!currentStatus) {
  // //     throw new BadRequestException([
  // //       { message: 'If the inputModel has incorrect values', field: 'status' },
  // //     ]);
  // //   }
  // //
  // //   if (currentStatus.status === like.status.likeStatus) {
  // //     return true;
  // //   }
  // //
  // //   if (like.status.likeStatus === LikeStatus.None) {
  // //     await this.LikeModel.deleteOne({
  // //       $and: [{ userId: like.userId }, { parentId: like.parentId }],
  // //     });
  // //
  // //     currentStatus.status === LikeStatus.Like
  // //       ? (post.likesCount -= 1)
  // //       : (post.dislikesCount -= 1);
  // //
  // //     await post.save();
  // //
  // //     return true;
  // //   }
  // //
  // //   if (like.status.likeStatus === LikeStatus.Like) {
  // //     post.likesCount += 1;
  // //     post.dislikesCount -= 1;
  // //   } else {
  // //     post.likesCount -= 1;
  // //     post.dislikesCount += 1;
  // //   }
  // //
  // //   currentStatus.status = like.status.likeStatus;
  // //
  // //   await post.save();
  // //
  // //   await currentStatus.save();
  // //
  // //   return true;
  // }

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
