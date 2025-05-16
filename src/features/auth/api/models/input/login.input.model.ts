import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginInputModel {

  @ApiProperty()
  @IsString()
  loginOrEmail: string;

  @ApiProperty()
  @IsString()
  password: string;
}
