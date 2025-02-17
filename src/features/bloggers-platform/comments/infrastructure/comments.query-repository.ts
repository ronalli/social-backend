import { ObjectId } from 'mongodb';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Comment, CommentModelType } from '../domain/comment.entity';
import { MappingsCommentsService } from '../application/mappings/mapping.comments';
import { ResultCode } from '../../../../settings/http.status';
import { LikeInfoOutputModel } from '../../../likes/api/models/like.info.output.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    private readonly mappingsCommentsService: MappingsCommentsService,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async getComment(id: string, status: string) {

    const query = `SELECT * FROM public."commentsPosts" WHERE id = $1;`

    const response = await this.dataSource.query(query, [id]);

    console.log(response);

    const query1 = `
      SELECT 
        c.id,
        c.content,
        c."postId",
        c."userId",
        c."createdAt",
        u.login AS "userLogin",
        s."likeStatus" as "myStatus"
      FROM public."commentsPosts" c 
      JOIN public.users u ON u.id = c."userId"
      JOIN public."postsLikeStatus" s ON s."postId" = c."postId" AND s."userId" = c."userId"
      WHERE c.id = $1
      ;
    `

    const result = await this.dataSource.query(query1, [id])

    console.log(result);

    // [
    //   {
    //     id: 'dce1c46c-71f6-4319-82fe-eae94210c3fe',
    //     content: 'hello my friends and all people world',
    //     postId: 'ed5310ca-a727-49cc-b4ec-3a77806f4397',
    //     userId: '236e918e-cd09-49f5-85f7-44c1fd785038',
    //     createdAt: '2025-02-14T19:58:22.761Z'
    //   }
    // ]




    // try {
    //   const currentComment = await this.CommentModel.findOne({
    //     _id: new ObjectId(id),
    //   });
    //
    //   if (currentComment) {
    //     const likesInfo: LikeInfoOutputModel = {
    //       likesCount: currentComment.likesCount,
    //       dislikesCount: currentComment.dislikesCount,
    //       myStatus: status,
    //     };
    //     return this.mappingsCommentsService.formatCommentForView(
    //       currentComment,
    //       likesInfo,
    //     );
    //   }
    //
    //   return false;
    // } catch (e) {
    //   throw new InternalServerErrorException(e);
    // }
  }

  async isCommentDoesExist(commentId: string): Promise<boolean>  {
    const query = `SELECT * FROM public."commentsPosts" WHERE id = $1;`

    const result = await this.dataSource.query(query, [commentId]);

    return result.length > 0;
  }

  async getLike(commentId: string, userId: string): Promise<boolean> {
    const query = `SELECT * FROM public."commentsLikeStatus" WHERE "commentId" = $1 AND "userId" = $2;`

    const result = await this.dataSource.query(query, [commentId, userId])

    return result.length > 0;
  }


  async getCommentById(id: string) {
    // try {
    //   const findComment = await this.CommentModel.findOne({
    //     _id: new ObjectId(id),
    //   });
    //
    //   if (findComment) {
    //     return {
    //       status: ResultCode.Success,
    //       data: this.mappingsCommentsService.formatDataCommentForView(
    //         findComment,
    //       ),
    //     };
    //   }
    //   return {
    //     errorMessage: 'Not found comment',
    //     status: ResultCode.NotFound,
    //     data: null,
    //   };
    // } catch (e) {
    //   throw new InternalServerErrorException(e);
    // }
  }

  async getCurrentLike(parentId: string, userId: string) {
    // const response = await this.LikeModel.findOne({
    //   $and: [{ userId: userId }, { parentId: parentId }],
    // });
    //
    // if (response) {
    //   return response;
    // }
    //
    // return response;
  }

  async getLikeById(likeId: string) {
    // return this.LikeModel.findOne({
    //   _id: new ObjectId(likeId),
    // });
  }
}
