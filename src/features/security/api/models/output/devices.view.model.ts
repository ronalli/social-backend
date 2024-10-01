import { IsString } from 'class-validator';

export class DevicesViewModel {
  @IsString()
  ip: string;

  @IsString()
  title: string;

  @IsString()
  lastActiveDate: string;

  @IsString()
  deviceId: string;
}
