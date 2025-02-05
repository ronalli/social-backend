import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../../../common/decorators/transform/trim';
export class PostUpdateSpecialModel {
  @IsString()
  @Trim()
  @Length(2, 30)
  title: string;

  @IsString()
  @Trim()
  @Length(5, 100)
  shortDescription: string;

  @IsString()
  @Trim()
  @Length(5, 1000)
  content: string;
}