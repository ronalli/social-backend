import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QuerySortSearch {

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

}