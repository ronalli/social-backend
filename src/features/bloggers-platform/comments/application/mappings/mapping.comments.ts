import { CommentDocument } from '../../domain/comment.entity';
import { CommentOutputModel } from '../../api/models/output/comment.output.model';
import { Injectable } from '@nestjs/common';
import { LikeModelType } from '../../../../likes/domain/like.entity';
import { LikeInfoOutputModel } from '../../../../likes/api/models/like.info.output.model';

@Injectable()
export class MappingsCommentsService {
  formatDataCommentForView(comment: CommentDocument): Omit<CommentOutputModel, 'likesInfo'> {
    return {
      id: String(comment._id),
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      content: comment.content,
    };
  }

  async formatDataAllCommentsForView(comments: CommentDocument[], currentUser: string | null, LikeModel: LikeModelType): Promise<CommentOutputModel[]> {

    const result: CommentOutputModel[] = [];

    for (const comment of comments) {

      const currentStatus = await LikeModel.findOne({ $and: [{ parentId: comment._id }, { userId: currentUser }] });

      const likesInfo: LikeInfoOutputModel = {
        likesCount: comment.likesCount,
        dislikesCount: comment.dislikesCount,
        myStatus: currentStatus?.status ? currentStatus.status : 'None',
      };

      result.push(this.formatCommentForView(comment, likesInfo));
    }
    return result;
  }

  formatCommentForView(comment: CommentDocument, likesInfo: LikeInfoOutputModel): CommentOutputModel {
    return {
      id: String(comment._id),
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      content: comment.content,
      likesInfo,
    };
  }
}

// export const mappingComments = {
//   formatDataCommentForView: (comment: CommentDocument): Omit<CommentOutputModel, 'likesInfo'> => {
//     return {
//       id: String(comment._id),
//       commentatorInfo: {
//         userId: comment.commentatorInfo.userId,
//         userLogin: comment.commentatorInfo.userLogin,
//       },
//       createdAt: comment.createdAt,
//       content: comment.content,
//     };
//   },
//   formatDataAllCommentsForView: async (comments: CommentDocument[], currentUser: string | null, LikeModel: LikeModelType): Promise<CommentOutputModel[]> => {
//
//     const result: CommentOutputModel[] = [];
//
//     for (const comment of comments) {
//
//       const currentStatus = await LikeModel.findOne({ $and: [{ parentId: comment._id }, { userId: currentUser }] });
//
//       const likesInfo: LikeInfoOutputModel = {
//         likesCount: comment.likesCount,
//         dislikesCount: comment.dislikesCount,
//         myStatus: currentStatus?.status ? currentStatus.status : 'None',
//       };
//
//       result.push(mappingComments.formatCommentForView(comment, likesInfo));
//     }
//     return result;
//   },
//
//   formatCommentForView: (comment: CommentDocument, likesInfo: LikeInfoOutputModel): CommentOutputModel => {
//     return {
//       id: String(comment._id),
//       commentatorInfo: {
//         userId: comment.commentatorInfo.userId,
//         userLogin: comment.commentatorInfo.userLogin,
//       },
//       createdAt: comment.createdAt,
//       content: comment.content,
//       likesInfo,
//     };
//   },
// };