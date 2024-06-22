export class CommentOutputModel {
  id: string
  content: string
  commentatorInfo: ICommentatorInfo
  createdAt: string
  likesInfo: ILikesInfoViewModel
}

interface ICommentatorInfo {
  userId: string
  userLogin: string
}

export interface ILikesInfoViewModel {
  likesCount: number
  dislikesCount: number
  myStatus: string
}