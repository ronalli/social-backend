import { IsString } from 'class-validator';

export class UserOutputModel {

  @IsString()
  id: string;

  @IsString()
  login: string;

  @IsString()
  email: string;

  @IsString()
  createdAt: string;
}