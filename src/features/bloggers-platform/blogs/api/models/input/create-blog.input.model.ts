import { IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../../../../../common/decorators/transform/trim';
import { ApiProperty } from '@nestjs/swagger';

export class BlogInputModel {

  @ApiProperty({
    maxLength: 15,
  })
  @IsString()
  @Trim()
  @Length(3, 15)
  name: string;

  @ApiProperty({
    maxLength: 500,
  })
  @IsString()
  @Trim()
  @Length(5, 500)
  description: string;

  @ApiProperty({
    maxLength: 100,
    pattern: '^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'
  })
  @IsString()
  @Trim()
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  @Length(4, 100)
  websiteUrl: string;
}
