import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PostStatus {
  None,
  Like,
  Dislike,
}

export class NewLike {
  @ApiProperty({
    description: 'Details about single like',
  })
  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  @IsString()
  addedAt: string;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  login: string;
}

export class PostExtendedLikesInfo {
  @ApiProperty({
    type: Number,
    format: 'int32',
  })
  likesCount: number;
  @ApiProperty({
    type: Number,
    format: 'int32',
  })
  dislikesCount: number;

  @ApiProperty({
    type: String,
    enum: PostStatus,
  })
  myStatus: PostStatus;

  @ApiProperty({
    type: [NewLike],
  })
  newestLikes: NewLike[];
}

export class PostOutputModel {
  @ApiProperty()
  @IsString()
  id: string;
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  shortDescription: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  blogId: string;

  @ApiProperty()
  @IsString()
  blogName: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  @IsString()
  createdAt: string;
  @ApiProperty({
    type: PostExtendedLikesInfo,
  })
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
  myStatus: PostStatus;
  likesCount: string;
  dislikesCount: string;
  newestLikes: NewLike[] | [];
}
