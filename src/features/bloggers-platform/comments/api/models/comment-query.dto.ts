import { QueryParamsDto, SortDirection } from '../../../../../common/models/query-params.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

// export enum SortDirection {
//   ASC = 'asc',
//   DESC = 'desc',
// }

export class CommentQueryDto extends QueryParamsDto {
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

  @ApiPropertyOptional({
    description: 'Field to sort by',
    default: 'createdAt',
  })
  sortBy?: string;

  @ApiPropertyOptional({
    enum: SortDirection,
    default: SortDirection.DESC,
  })
  sortDirection?: SortDirection;
}
