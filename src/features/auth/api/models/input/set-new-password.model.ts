import { IsNotEmpty, IsString } from 'class-validator';

export class SetNewPasswordModel {
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  recoveryCode: string;
}
