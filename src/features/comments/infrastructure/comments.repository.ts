import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../domain/comment.entity';
import { ResultCode } from '../../../settings/http.status';

import { UsersQueryRepository } from '../../users/infrastructure/users.query-repository';
import { CommentCreateModel } from '../api/models/input/create-comment.model';
import { Like, LikeModelType } from '../../likes/domain/like.entity';
import { QueryParamsDto } from '../../../common/models/query-params.dto';
import { QueryParamsService } from '../../../common/utils/create.default.values';
import { MappingsCommentsService } from '../application/mappings/mapping.comments';

export interface ILikesInfoViewModel {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
}

@Injectable()
export class CommentsRepository {
  constructor(@InjectModel(Comment.name) private CommentModel: CommentModelType,
              @InjectModel(Like.name) private LikeModel: LikeModelType, private readonly usersQueryRepository: UsersQueryRepository, private readonly queryParamsService: QueryParamsService, private readonly mappingsCommentsService: MappingsCommentsService) {
  }

  async updateComment(id: string, contentUpdate: string) {
    try {
      const findComment = await this.CommentModel.findOne({ _id: new ObjectId(id) });
      if (findComment) {
        findComment.content = contentUpdate;
        await findComment.save();
        return { status: ResultCode.NotContent, data: null };
      }
      return { errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null };
    } catch (e) {
      return { errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null };
    }
  }

  async deleteComment(id: string) {
    try {
      await this.CommentModel.deleteOne({ _id: new ObjectId(id) });
      return { status: ResultCode.NotContent, data: null };
    } catch (e) {
      return { errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null };
    }
  }

  async addComment(data: CommentCreateModel) {

    // const result = await this.usersQueryRepository.findUserById(data.userId);
    // try {
    //   const newComment = new this.CommentModel({
    //     // _id: new Types.ObjectId(),
    //     postId: data.postId,
    //     content: data.content,
    //     createdAt: new Date().toISOString(),
    //     commentatorInfo: {
    //       userId: data.userId,
    //       userLogin: result.login,
    //     },
    //     likesCount: 0,
    //     dislikesCount: 0,
    //   });
    //   const response = await newComment.save();
    //   const comment = await this.CommentModel.findOne({ _id: new ObjectId(response._id) });
    //
    //   const likesInfo: ILikesInfoViewModel = {
    //     likesCount: 0,
    //     dislikesCount: 0,
    //     myStatus: 'None',
    //   };
    //
    //   if (comment) {
    //     const res = this.mappingsCommentsService.formatCommentForView(comment, likesInfo);
    //     return { status: ResultCode.Created, data: res };
    //   }
    //   return { errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null };
    // } catch (e) {
    //   return { errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null };
    // }
  }

  // async addStatusLike(data: Omit<ILikeTypeDB, 'addedAt'>) {
  //   const like = new LikeModel();
  //
  //   like.userId = data.userId;
  //   like.parentId = data.parentId;
  //   like.status = data.status;
  //   like.login = data.login
  //   like.addedAt = new Date().toISOString();
  //
  //   await like.save();
  //
  //   return like;
  // }

  // async updateStatusLike(data: Omit<ILikeTypeDB, 'addedAt'>, comment: CommentDocument) {
  //
  //   const currentStatus = await LikeModel.findOne(({
  //     $and: [{userId: data.userId}, {parentId: data.parentId}]
  //   }))
  //
  //   if (!currentStatus) {
  //     return {
  //       status: ResultCode.BadRequest, data: null, errorsMessages: [
  //         {
  //           "message": "Wrong",
  //           "field": 'status'
  //         }
  //       ]
  //     }
  //   }
  //
  //   if (currentStatus.status === data.status) {
  //     return {status: ResultCode.NotContent, data: null}
  //   }
  //
  //
  //   if(data.status === LikeStatus.Like) {
  //     comment.likesCount += 1;
  //     comment.dislikesCount -= 1;
  //   } else if(data.status === LikeStatus.Dislike) {
  //     comment.likesCount -= 1;
  //     comment.dislikesCount += 1;
  //   } else {
  //     currentStatus.status === LikeStatus.Like ? comment.likesCount -= 1 : comment.dislikesCount -= 1
  //   }
  //
  //   currentStatus.status = data.status;
  //
  //   await comment.save();
  //
  //   await currentStatus.save();
  //
  //   return {status: ResultCode.NotContent, data: null}
  // }

  async getCommentById(id: string) {
    return this.CommentModel.findOne({ _id: new ObjectId(id) });
  }

  async getCommentsForSpecialPost(postId: string, queryParams: QueryParamsDto, currentUser: string | null) {
    const query = this.queryParamsService.createDefaultValuesQueryParams(queryParams);

    console.log(query);

    try {
      const filter = { postId: postId };
      const comments = await this.CommentModel.find(filter)
        .sort({ [query.sortBy]: query.sortDirection })
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(query.pageSize);

      const totalCount = await this.CommentModel.countDocuments(filter);

      return {
        status: ResultCode.Success,
        data: {
          pagesCount: Math.ceil(totalCount / query.pageSize),
          pageSize: query.pageSize,
          page: query.pageNumber,
          totalCount,
          items: await this.mappingsCommentsService.formatDataAllCommentsForView(comments, currentUser, this.LikeModel),
        },

      };
    } catch (e) {
      return { errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null };
    }
  }

  async getCurrentLike(parentId: string, userId: string) {
    return this.LikeModel.findOne(({
      $and: [{ userId: userId }, { parentId: parentId }],
    }));
  }
}