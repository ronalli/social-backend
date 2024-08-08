import { IsString } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim';

export class BlogCreateModel {
  @IsString()
  @Trim()
  name: string;

  @IsString()
  @Trim()
  description: string;

  @IsString()
  @Trim()
  websiteUrl: string;
}