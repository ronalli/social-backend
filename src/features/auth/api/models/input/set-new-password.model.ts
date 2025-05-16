import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetNewPasswordModel {
  @ApiProperty({
    maxLength: 20,
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  newPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recoveryCode: string;
}
