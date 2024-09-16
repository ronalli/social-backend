import { IsMongoId, IsNotEmpty, IsString, Length, ValidateNested } from 'class-validator';
import { Trim } from '../../../../../../common/decorators/transform/trim';

export class PostCreateModel {

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

  // @IdMongoValidate()
  // @ValidateNested()
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  // @IdMongoValidate({ message: 'Invalid MongoDB ID' })
  // @BlogIsExist({ message: 'Blog does not exist' })
  // @BlogIsExist()
  blogId: string;
}