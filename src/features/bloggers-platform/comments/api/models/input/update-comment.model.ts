import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentModel {

  @ApiProperty({
    maxLength: 300,
    minLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @Length(20, 300)
  content: string;
}
