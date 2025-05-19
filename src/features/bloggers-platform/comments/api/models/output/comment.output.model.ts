import { IsEnum, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LikeStatus } from '../../../../../likes/domain/like.entity';

class CommentatorInfo {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  userLogin: string;
}

export class LikesInfoViewModel {
  @ApiProperty({
    type: Number,
    format: 'int32',
  })
  @IsNumber()
  likesCount: number;

  @ApiProperty({
    type: Number,
    format: 'int32',
  })
  @IsNumber()
  dislikesCount: number;

  @ApiProperty({
    enum: LikeStatus,
    description: 'Send None if you want to unlike/undislike',
  })
  @IsString()
  @IsEnum(LikeStatus, { message: 'likeStatus must be Like, Dislike, or None' })
  myStatus: LikeStatus;
}

export class CommentOutputModel {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({
    type: CommentatorInfo,
  })
  commentatorInfo: CommentatorInfo;

  @IsString()
  createdAt: string;

  @ApiProperty({
    type: LikesInfoViewModel,
  })
  likesInfo: LikesInfoViewModel;
}

export class CommentOutputModelDB {
  id: string;
  content: string;
  postId: string;
  userId: string;
  createdAt: string;
}
