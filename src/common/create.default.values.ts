import {SortDirection} from "mongodb";
import { QueryParamsDto } from './query-params.dto';

export const createDefaultValues = (query: QueryParamsDto) => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
    sortBy: query.sortBy ? query.sortBy : "createdAt",
    sortDirection: query.sortDirection ? query.sortDirection as SortDirection : "desc",
    searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
  }
}

export const createDefaultValuesQueryParams = (query: QueryParamsDto) => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
    sortBy: query.sortBy ? query.sortBy : "createdAt",
    sortDirection: query.sortDirection ? query.sortDirection as SortDirection : "desc",
  }
}
