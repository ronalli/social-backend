import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim';

export class RecoveryPasswordInputModel {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @Matches(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/)
  // @EmailIsExist()
  email: string;
}
