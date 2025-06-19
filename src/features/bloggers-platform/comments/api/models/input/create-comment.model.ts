import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../../../../common/decorators/transform/trim';

export class CommentCreateModel {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @Trim()
  content: string;

  @IsString()
  @Trim()
  postId: string;

  @IsString()
  @Trim()
  userId: string;

  @IsString()
  createdAt: Date;
}
