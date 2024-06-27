import { IsNotEmpty, IsString } from 'class-validator';

export class InfoCurrentUserModel {

  @IsString()
  @IsNotEmpty()
  userId: string

  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  login: string
}