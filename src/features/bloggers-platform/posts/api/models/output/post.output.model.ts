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
  extendedLikesInfo: PostExtendedLikesInfo;
}

export class PostOutputModelDB {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  createdAt: string;
}

export class PostDB {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  myStatus: string;
  likesCount: string;
  dislikesCount: string;
  newestLikes: NewLike[] | [];
}
