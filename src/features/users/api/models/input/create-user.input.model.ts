import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim';

export class UserCreateModel {

  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @Matches(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}