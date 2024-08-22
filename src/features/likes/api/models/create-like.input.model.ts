import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike'
}

export class LikeStatusModel {
  @IsNotEmpty()
  @IsString()
  @IsEnum(LikeStatus, {message: 'likeStatus must be Like, Dislike, or None'})
  likeStatus: LikeStatus
}