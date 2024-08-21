import { ObjectId } from 'mongodb';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../domain/comment.entity';
import { ResultCode } from '../../../settings/http.status';
import { Like, LikeModelType } from '../../likes/domain/like.entity';
import { LikeInfoOutputModel } from '../../likes/api/models/like.info.output.model';
import { MappingsCommentsService } from '../application/mappings/mapping.comments';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectModel(Comment.name) private CommentModel: CommentModelType,
              @InjectModel(Like.name) private LikeModel: LikeModelType, private readonly mappingsCommentsService: MappingsCommentsService) {
  }

  async getComment(id: string, status: string) {
    try {
      const currentComment = await this.CommentModel.findOne({ _id: new ObjectId(id) });

      if (currentComment) {

        const likesInfo: LikeInfoOutputModel = {
          likesCount: currentComment.likesCount,
          dislikesCount: currentComment.dislikesCount,
          myStatus: status,
        };
        return  this.mappingsCommentsService.formatCommentForView(currentComment, likesInfo);
      }

      return false;

    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async getCommentById(id: string) {
    try {
      const findComment = await this.CommentModel.findOne({ _id: new ObjectId(id) });

      if (findComment) {
        return {
          status: ResultCode.Success,
          data: this.mappingsCommentsService.formatDataCommentForView(findComment),
        };
      }
      return { errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null };
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async getCurrentLike(parentId: string, userId: string) {
    const response = await this.LikeModel.findOne(({
      $and: [{ userId: userId }, { parentId: parentId }],
    }));

    if (response) {
      return response;
    }

    return response;
  }

  async getLikeById(likeId: string) {
    return this.LikeModel.findOne({_id: new ObjectId(likeId)
    });
  }

}