import { SortDirection } from 'mongodb';
import { IsOptional, IsString } from 'class-validator';


export class QueryParamsDto {

  @IsOptional()
  @IsString()
  searchNameTerm?: string;

  @IsOptional()
  sortDirection?: SortDirection;

  @IsOptional()
  sortBy?: string;

  @IsOptional()
  pageSize?: number;

  @IsOptional()
  pageNumber?: number;

}