import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrationConfirmationCode {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}
