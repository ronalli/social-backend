import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrationEmailResending {

  @ApiProperty({
    pattern: '[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,4}$',
    example: 'example@example.com'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}