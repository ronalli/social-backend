import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../../../common/decorators/transform/trim';
import { ApiProperty } from '@nestjs/swagger';

export class PostInputModel {

  @ApiProperty({
    maxLength: 30,
  })
  @IsString()
  // @Trim()
  @Length(2, 30)
  title: string;

  @ApiProperty({
    maxLength: 100,
  })
  @IsString()
  // @Trim()
  @Length(5, 100)
  shortDescription: string;

  @ApiProperty({
    maxLength: 1000,
  })
  @IsString()
  // @Trim()
  @Length(5, 1000)
  content: string;
}
