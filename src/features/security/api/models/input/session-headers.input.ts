import { IsString } from 'class-validator';

export class SessionHeadersInput {

  @IsString()
  deviceName: string;

  @IsString()
  ip: string;
}
