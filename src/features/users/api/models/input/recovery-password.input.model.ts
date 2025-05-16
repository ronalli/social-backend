import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim';
import { ApiProperty } from '@nestjs/swagger';

export class RecoveryPasswordInputModel {

  @ApiProperty({
    pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', example: 'useremail@company.com'
  })
  @IsString()
  @Trim()
  @IsNotEmpty()
  @Matches(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/)
  // @EmailIsExist()
  email: string;
}
