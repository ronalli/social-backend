import { IsString } from 'class-validator';
import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Trim } from '../../../../../../common/decorators/transform/trim';

export class CommentCreateModel {

  @Prop({type: Types.ObjectId, auto: true})
  _id: Types.ObjectId;

  @IsString()
  @Trim()
  postId: string;

  @IsString()
  @Trim()
  userId: string;

  @IsString()
  @Trim()
  content: string;
}