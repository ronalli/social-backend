import { IsMongoId, IsNotEmpty, IsString, Length, ValidateNested } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim';
import { BlogIsExist } from '../../../../../common/decorators/validate/blog-is-exist.decorator';
import { IdMongoValidate } from '../../../../../common/decorators/validate/id-mongo-validate';
import { CustomValidationPipe } from '../../../../../common/pipes/pipe';
import { ValidationPipe } from '@nestjs/common';
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