import { IsOptional, IsString } from 'class-validator';

// export type SortDirection = 'ASC' | 'DESC';


export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export class QueryParamsDto {
  @IsOptional()
  @IsString()
  searchNameTerm?: string = null;

  @IsOptional()
  sortDirection?: SortDirection = SortDirection.DESC;

  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsOptional()
  pageSize?: number = 10;

  @IsOptional()
  pageNumber?: number = 1;
}
