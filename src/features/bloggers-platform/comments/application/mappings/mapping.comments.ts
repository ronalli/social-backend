import { CommentOutputModel } from '../../api/models/output/comment.output.model';
import { Injectable } from '@nestjs/common';
import { LikeInfoOutputModel } from '../../../../likes/api/models/like.info.output.model';

@Injectable()
export class MappingsCommentsService {
  formatingCommentForView(comment: any): CommentOutputModel {
    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: {
        userId: comment.userId,
        userLogin: comment.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: +comment.likesCount,
        dislikesCount: +comment.dislikesCount,
        myStatus: comment.myStatus ?? 'None'
      },
    };
  }

  // {
  //   id: '8c185332-b8b6-46fd-ba28-8e5c1cadf65f',
  //   content: '66666666666666666666666666666666666666666',
  //   userId: '236e918e-cd09-49f5-85f7-44c1fd785038',
  //   createdAt: '2025-02-11T18:48:48.099Z',
  //   userLogin: 'nikita',
  //   myStatus: 'None',
  //   likesCount: '1',
  //   dislikesCount: '0'
  // }

  async formatDataAllCommentsForView(comments: any) {
    const result: CommentOutputModel[] = [];

    for (const comment of comments) {
      result.push(this.formatingCommentForView(comment));
    }
    return result;
  }

  // formatCommentForView(
  //   // comment: CommentDocument,
  //   // likesInfo: LikeInfoOutputModel,
  // ): CommentOutputModel {
  //   return {
  //     id: String(comment._id),
  //     commentatorInfo: {
  //       userId: comment.commentatorInfo.userId,
  //       userLogin: comment.commentatorInfo.userLogin,
  //     },
  //     createdAt: comment.createdAt,
  //     content: comment.content,
  //     likesInfo,
  //   };
  // }
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
