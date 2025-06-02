import { IsBoolean, IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BlogOutputModel {

  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  websiteUrl: string;

  @ApiProperty({type: String, format: 'date-time'})
  @IsDateString()
  createdAt: Date;

  @ApiProperty()
  @IsBoolean()
  isMembership: boolean;
}