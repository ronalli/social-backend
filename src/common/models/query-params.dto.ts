import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

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
  @Transform(({value}) => value?.toUpperCase())
  @IsEnum(SortDirection, { message: 'SortDirection must be ASC or DESC' })
  sortDirection?: SortDirection = SortDirection.DESC;

  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsOptional()
  pageSize?: number = 10;

  @IsOptional()
  pageNumber?: number = 1;
}
