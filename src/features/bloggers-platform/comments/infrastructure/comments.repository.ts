import { ObjectId } from 'mongodb';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../domain/comment.entity';
import { MappingsCommentsService } from '../application/mappings/mapping.comments';
import { UpdateLikeStatusCommentCommand } from '../application/usecases/update-likeStatus.usecase';
import { UpdateCommentModel } from '../api/models/input/update-comment.model';
import {
  Like,
  LikeDocument,
  LikeModelType,
  LikeStatus,
} from '../../../likes/domain/like.entity';
import { QueryParamsService } from '../../../../common/utils/create.default.values';
import { QueryParamsDto } from '../../../../common/models/query-params.dto';
import { CommentCreateModel } from '../api/models/input/create-comment.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export interface ILikesInfoViewModel {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
}

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    private readonly queryParamsService: QueryParamsService,
    private readonly mappingsCommentsService: MappingsCommentsService,
  ) {}

  async updateComment(id: string, contentUpdate: UpdateCommentModel): Promise<boolean> {
    const query = `UPDATE public."commentsPosts" SET content = $1 WHERE id = $2;`;

    const response = await this.dataSource.query(query, [contentUpdate.content, id]);

   return response[1] > 0


    // try {
    //   const findComment = await this.CommentModel.findOne({
    //     _id: new ObjectId(id),
    //   });
    //   if (findComment) {
    //     findComment.content = contentUpdate.content;
    //     await findComment.save();
    //     return true;
    //   }
    //   return false;
    // } catch (e) {
    //   throw new InternalServerErrorException(e);
    // }
  }

  async deleteComment(id: string) {
    // try {
    //   await this.CommentModel.deleteOne({ _id: new ObjectId(id) });
    //   return true;
    // } catch (e) {
    //   throw new InternalServerErrorException(e);
    // }
  }

  async createComment(comment: CommentCreateModel) {
    const { id, content, postId, userId, createdAt } = comment;

    const query = `INSERT INTO public."commentsPosts" (id, content, "postId", "userId", "createdAt") VALUES($1, $2, $3, $4, $5) RETURNING *`;

    const response = await this.dataSource.query(query, [
      id,
      content,
      postId,
      userId,
      createdAt,
    ]);

    return response[0];
  }

  // async addComment(data: CommentCreateModel) {
  //   // const result = await this.usersQueryRepository.findUserById(data.userId);
  //   // try {
  //   //   const newComment = new this.CommentModel({
  //   //     // _id: new Types.ObjectId(),
  //   //     postId: data.postId,
  //   //     content: data.content,
  //   //     createdAt: new Date().toISOString(),
  //   //     commentatorInfo: {
  //   //       userId: data.userId,
  //   //       userLogin: result.login,
  //   //     },
  //   //     likesCount: 0,
  //   //     dislikesCount: 0,
  //   //   });
  //   //   const response = await newComment.save();
  //   //   const comment = await this.CommentModel.findOne({ _id: new ObjectId(response._id) });
  //   //
  //   //   const likesInfo: ILikesInfoViewModel = {
  //   //     likesCount: 0,
  //   //     dislikesCount: 0,
  //   //     myStatus: 'None',
  //   //   };
  //   //
  //   //   if (comment) {
  //   //     const res = this.mappingsCommentsService.formatCommentForView(comment, likesInfo);
  //   //     return { status: ResultCode.Created, data: res };
  //   //   }
  //   //   return { errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null };
  //   // } catch (e) {
  //   //   return { errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null };
  //   // }
  // }

  async addStatusLike(like: LikeDocument) {
    // try {
    //   const insertResult = await this.LikeModel.insertMany([like]);
    //   return insertResult[0].id;
    // } catch (e) {
    //   throw new InternalServerErrorException(e);
    // }
  }

  async updateStatusLike(
    like: UpdateLikeStatusCommentCommand,
    comment: CommentDocument,
  ) {
    // const currentStatus = await this.LikeModel.findOne({
    //   $and: [{ userId: like.userId }, { parentId: like.parentId }],
    // });
    //
    // if (!currentStatus) {
    //   throw new BadRequestException([
    //     { message: 'If the inputModel has incorrect values', field: 'status' },
    //   ]);
    // }
    //
    // if(like.status.likeStatus === LikeStatus.None) {
    //   await this.LikeModel.deleteOne({$and: [{ userId: like.userId }, { parentId: like.parentId }]})
    //
    //   currentStatus.status === LikeStatus.Like ? comment.likesCount -=1 : comment.dislikesCount -= 1;
    //
    //   await comment.save()
    //
    //   return true;
    // }
    //
    // if (currentStatus.status === like.status.likeStatus) {
    //   return true
    // }
    //
    // if (like.status.likeStatus === LikeStatus.Like) {
    //   comment.likesCount += 1;
    //   comment.dislikesCount -= 1;
    // } else  {
    //   comment.likesCount -= 1;
    //   comment.dislikesCount += 1;
    // }
    //
    // currentStatus.status = like.status.likeStatus;
    //
    // await comment.save();
    //
    // await currentStatus.save();
    //
    // return true;
  }

  async getCommentById(id: string) {
    // return this.CommentModel.findOne({ _id: new ObjectId(id) });
  }

  async getCommentsForSpecialPost(
    postId: string,
    queryParams: QueryParamsDto,
    currentUser: string | null,
  ) {
    // const query =
    //   this.queryParamsService.createDefaultValuesQueryParams(queryParams);
    //
    // try {
    //   const filter = { postId: postId };
    //   const comments = await this.CommentModel.find(filter)
    //     .sort({ [query.sortBy]: query.sortDirection })
    //     .skip((query.pageNumber - 1) * query.pageSize)
    //     .limit(query.pageSize);
    //
    //   const totalCount = await this.CommentModel.countDocuments(filter);
    //
    //   return {
    //     data: {
    //       pagesCount: Math.ceil(totalCount / query.pageSize),
    //       pageSize: query.pageSize,
    //       page: query.pageNumber,
    //       totalCount,
    //       items:
    //         await this.mappingsCommentsService.formatDataAllCommentsForView(
    //           comments,
    //           currentUser,
    //           this.LikeModel,
    //         ),
    //     },
    //   };
    // } catch (e) {
    //   throw new InternalServerErrorException(e);
    // }
  }

  async getCurrentLike(parentId: string, userId: string) {
    // return this.LikeModel.findOne({
    //   $and: [{ userId: userId }, { parentId: parentId }],
    // });
  }
}
