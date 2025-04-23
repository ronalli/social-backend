import { IsString } from 'class-validator';

export class DeviceSessionEntity {
  @IsString()
  id: string;

  @IsString()
  deviceId: string;

  @IsString()
  deviceName: string;

  @IsString()
  exp: string;

  @IsString()
  iat: string;

  @IsString()
  ip: string;

  @IsString()
  userId: string;
}
