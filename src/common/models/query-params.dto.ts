import { IsOptional, IsString } from 'class-validator';

export type SortDirection = 'asc' | 'desc';

export class QueryParamsDto {
  @IsOptional()
  @IsString()
  searchNameTerm?: string = null;

  @IsOptional()
  sortDirection?: SortDirection = 'desc';

  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsOptional()
  pageSize?: number = 10;

  @IsOptional()
  pageNumber?: number = 1;
}
