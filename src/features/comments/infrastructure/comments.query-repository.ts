import {ObjectId} from "mongodb";
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../domain/comment.entity';
import { ResultCode } from '../../../settings/http.status';
import { mappingComments } from '../../../common/mapping.comments';
import { Like, LikeModelType } from '../../likes/domain/like.entity';

export interface ILikesInfoViewModel {
  likesCount: number
  dislikesCount: number
  myStatus: string
}

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectModel(Comment.name) private CommentModel: CommentModelType,
              @InjectModel(Like.name) private LikeModel: LikeModelType) {
  }
  async getComment(id: string, status: string) {
    try {
      const currentComment = await this.CommentModel.findOne({_id: new ObjectId(id)})

      if (currentComment) {

        const likesInfo: ILikesInfoViewModel = {
          likesCount: currentComment.likesCount,
          dislikesCount: currentComment.dislikesCount,
          myStatus: status
        }

        return {
          status: ResultCode.Success,
          data: mappingComments.formatCommentForView(currentComment, likesInfo)
        }

      }
      return {errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null}

    } catch (e) {
      return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
    }
  }

  async getCommentById(id: string) {
    try {
      const findComment = await this.CommentModel.findOne({_id: new ObjectId(id)});

      if (findComment) {
        return {
          status: ResultCode.Success,
          data: mappingComments.formatDataCommentForView(findComment)
        }
      }
      return {errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null}
    } catch (e) {
      return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
    }
  }

  async getCurrentLike(parentId: string, userId: string) {
    const response = await this.LikeModel.findOne(({
      $and: [{userId: userId}, {parentId: parentId}]
    }))

    if (response) {
      return response;
    }

    return response;
  }
}