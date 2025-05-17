import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DevicesViewModel {

  @ApiProperty()
  @IsString()
  ip: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  lastActiveDate: string;

  @ApiProperty()
  @IsString()
  deviceId: string;
}
