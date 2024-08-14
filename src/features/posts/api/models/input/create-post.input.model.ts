import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim';

export class PostCreateModel {
  @IsString()
  @Trim()
  @Length(3, 30)
  title: string;

  @IsString()
  @Trim()
  @Length(10, 100)
  shortDescription: string;

  @IsString()
  @Trim()
  @Length(25, 1000)
  content: string;

  @IsString()
  @Trim()
  blogId: string;
}