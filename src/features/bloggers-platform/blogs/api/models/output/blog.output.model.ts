import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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
  createdAt: string;

  @ApiProperty()
  @IsBoolean()
  isMembership: boolean;
}

export class BlogViewModel {
  @ApiProperty()
  @IsNumber()
  pagesCount: number;

  @ApiProperty()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsNumber()
  pageSize: number;

  @ApiProperty()
  @IsNumber()
  totalCount: number;

  @ApiProperty({type: [BlogOutputModel]})
  items: BlogOutputModel[];
}