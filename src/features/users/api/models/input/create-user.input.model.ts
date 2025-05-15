import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim';
import { ApiProperty } from '@nestjs/swagger';
// import { LoginIsExist } from '../../../../../common/decorators/validate/login-is-exist.decorator';
// import { EmailIsExist } from '../../../../../common/decorators/validate/email-is-exist.decorator';

export class UserCreateModel {
  @ApiProperty({maxLength: 10, minLength: 3, pattern: '^[a-zA-Z0-9_-]*$'})
  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  // @LoginIsExist()
  login: string;

  @ApiProperty({maxLength: 20, minLength: 6})
  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @ApiProperty({pattern: '^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,4}$', example: 'bob@example.com'})
  @IsString()
  @Trim()
  @IsNotEmpty()
  @Matches(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/)
  // @EmailIsExist()
  email: string;
}
