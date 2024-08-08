import { IsString } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim';

export class CommentCreateModel {
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