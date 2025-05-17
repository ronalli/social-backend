import { QueryParamsDto } from '../../../../../../common/models/query-params.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export class BlogsQueryDto extends QueryParamsDto {
  @ApiPropertyOptional({
    description:
      'Search term for blog Name: Name should contains this term in any position',
    default: null,
  })
  searchNameTerm?: string;

  @ApiPropertyOptional({
    enum: SortDirection,
    description: 'Available values: asc, desc',
    default: SortDirection.DESC,
  })
  sortDirection?: SortDirection;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    default: 'createdAt',
  })
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'pageNumber is number of portions that should be returned',
    default: 1,
  })
  pageNumber?: number;

  @ApiPropertyOptional({
    description: 'pageSize is portions size that should be returned',
    default: 10,
  })
  pageSize?: number;

}
