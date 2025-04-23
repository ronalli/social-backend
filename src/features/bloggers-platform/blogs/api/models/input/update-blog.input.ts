import { IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../../../../../common/decorators/transform/trim';

export class BlogUpdateModel {
  @IsString()
  blogId: string;

  @IsString()
  @Trim()
  @Length(3, 15)
  name: string;

  @IsString()
  @Trim()
  @Length(5, 500)
  description: string;

  @IsString()
  @Trim()
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  @Length(4, 100)
  websiteUrl: string;
}
