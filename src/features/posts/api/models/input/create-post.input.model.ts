import { IsString } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim';

export class PostCreateModel {
  @IsString()
  @Trim()
  title: string;

  @IsString()
  @Trim()
  shortDescription: string;

  @IsString()
  @Trim()
  content: string;

  @IsString()
  @Trim()
  blogId: string;
}