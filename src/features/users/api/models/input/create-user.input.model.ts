import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim';
// import { LoginIsExist } from '../../../../../common/decorators/validate/login-is-exist.decorator';
// import { EmailIsExist } from '../../../../../common/decorators/validate/email-is-exist.decorator';

export class UserCreateModel {

  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  // @LoginIsExist()
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
  // @EmailIsExist()
  email: string;
}