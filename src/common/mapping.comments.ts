import { CommentDocument } from '../features/comments/domain/comment.entity';
import { CommentOutputModel } from '../features/comments/api/models/output/comment.output.model';
import { LikeInfoOutputModel } from '../features/likes/api/models/like.info.output.model';
import { LikeModelType } from '../features/likes/domain/like.entity';


export const mappingComments = {
  formatDataCommentForView: (comment: CommentDocument, ): Omit<CommentOutputModel, "likesInfo"> => {
    return {
      id: String(comment._id),
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      content: comment.content,
    }
  },
  formatDataAllCommentsForView: async (comments: CommentDocument[], currentUser: string | null, LikeModel: LikeModelType): Promise<CommentOutputModel[]> => {

    const result: CommentOutputModel[] = []

    for (const comment of comments) {

      const currentStatus = await LikeModel.findOne({$and: [{parentId: comment._id}, {userId: currentUser}]});

      const likesInfo: LikeInfoOutputModel = {
        likesCount: comment.likesCount,
        dislikesCount: comment.dislikesCount,
        myStatus: currentStatus?.status ? currentStatus.status : 'None'
      }

      result.push(mappingComments.formatCommentForView(comment, likesInfo));
    }
    return result;
  },

  formatCommentForView: (comment: CommentDocument, likesInfo: LikeInfoOutputModel): CommentOutputModel => {
    return {
      id: String(comment._id),
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      content: comment.content,
      likesInfo
    }
  },
}