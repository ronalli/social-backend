import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export class LikeStatusModelForPost {
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(LikeStatus, { message: 'likeStatus must be Like, Dislike, or None' })
  likeStatus: LikeStatus;

  @IsString()
  userId: string;

  @IsString()
  postId: string;

  @IsString()
  createdAt: Date;
}

export class LikeStatusModelForComment {
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(LikeStatus, { message: 'likeStatus must be Like, Dislike, or None' })
  likeStatus: LikeStatus;

  @IsString()
  userId: string;

  @IsString()
  commentId: string;

  @IsString()
  createdAt: Date;
}
