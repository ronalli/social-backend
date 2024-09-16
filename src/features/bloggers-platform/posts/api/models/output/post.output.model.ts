export class NewLike {
  addedAt: string;
  userId: string;
  login: string;
}


export class PostExtendedLikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: NewLike[];
}


export class PostOutputModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: PostExtendedLikesInfo
}