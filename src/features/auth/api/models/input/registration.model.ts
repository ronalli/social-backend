import { IsString } from 'class-validator';

export class RegistrationModelUser {

  @IsString()
  id: string;

  @IsString()
  login: string;

  @IsString()
  email: string;

  @IsString()
  hash: string;

  @IsString()
  createdAt: string;
}