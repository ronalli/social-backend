import { QueryParamsDto, SortDirection } from '../models/query-params.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryParamsService {
  createDefaultValues(query: QueryParamsDto) {
    return {
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize:
        query.pageSize !== undefined
          ? +query.pageSize > 50
            ? 50
            : +query.pageSize
          : 10,
      sortBy: query.sortBy ? query.sortBy : 'createdAt',
      sortDirection: query.sortDirection
        ? query.sortDirection
        : SortDirection.DESC,
      searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
    };
  }

  createDefaultValuesQueryParams = (query: QueryParamsDto) => {
    return {
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize:
        query.pageSize !== undefined
          ? +query.pageSize > 50
            ? 50
            : +query.pageSize
          : 10,
      sortBy: query.sortBy ? query.sortBy : 'createdAt',
      sortDirection: query.sortDirection
        ? query.sortDirection
        : SortDirection.DESC,
    };
  };
}

// export const createDefaultValues = (query: QueryParamsDto) => {
//   return {
//     pageNumber: query.pageNumber ? +query.pageNumber : 1,
//     pageSize: query.pageSize !== undefined ? +query.pageSize > 50 ? 50 : +query.pageSize : 10,
//     sortBy: query.sortBy ? query.sortBy : 'createdAt',
//     sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
//     searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
//   };
// };

// export const createDefaultValuesQueryParams = (query: QueryParamsDto) => {
//   return {
//     pageNumber: query.pageNumber ? +query.pageNumber : 1,
//     pageSize: query.pageSize !== undefined ? +query.pageSize > 50 ? 50 : +query.pageSize : 10,
//     sortBy: query.sortBy ? query.sortBy : 'createdAt',
//     sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
//   };
// };
