import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { BlogOutputModel } from './blog.output.model';

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