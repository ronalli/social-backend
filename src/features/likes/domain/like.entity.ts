import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export class LikeStatusEntity {

  @ApiProperty({
    enum: LikeStatus,
  })
  @IsString()
  @IsEnum(LikeStatus, { message: 'likeStatus must be Like, Dislike, or None' })
  likeStatus: LikeStatus;
}