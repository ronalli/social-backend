import { Injectable } from '@nestjs/common';
import { LikeStatusModelForPost } from '../api/models/create-like.input.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  UpdateLikeStatusPostCommand
} from '../../bloggers-platform/posts/application/usecases/update-likeStatus.post.usecase';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
  ) {
  }

  async addStatusLikeOnPost(likeStatusPost: LikeStatusModelForPost) : Promise<boolean>{

    const {id, likeStatus, postId, createdAt, userId} = likeStatusPost;

    const query = `INSERT INTO "postsLikeStatus" (id, "likeStatus", "postId", "createdAt", "userId") VALUES($1, $2, $3, $4, $5) RETURNING *`

    const result = await this.dataSource.query(query, [id, likeStatus, postId, createdAt, userId])

    return result.length > 0;

  }

  async updateStatusLikeInPost(likeStatusPost: UpdateLikeStatusPostCommand): Promise<boolean> {

    const {postId, status, userId} = likeStatusPost;

      const query = `UPDATE "postsLikeStatus" SET "likeStatus" = $1 WHERE "userId" = $2 AND "postId" = $3;`;

      const response = await this.dataSource.query(query, [status, userId, postId]);


    return response[1] > 0;

  }


}