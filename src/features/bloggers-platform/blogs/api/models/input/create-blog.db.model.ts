import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../../common/decorators/transform/trim';

export class PostCreateDBModel {

  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsNotEmpty()
  @Trim()
  @Length(2, 30)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  @Length(5, 100)
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  @Length(5, 1000)
  content: string;

  @IsString()
  @IsNotEmpty()
  blogId: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string

}