import { IsString } from 'class-validator';

export class RegistrationModelUser {

  @IsString()
  login: string;

  @IsString()
  email: string;

  @IsString()
  hash: string;

  @IsString()
  createdAt: string;
}