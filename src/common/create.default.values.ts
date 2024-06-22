import {SortDirection} from "mongodb";

export interface IMainQueryType {
  pageNumber?: number,
  pageSize?: number,
  sortBy?: string,
  sortDirection?: SortDirection,
}

export interface IQueryType {
  pageNumber?: number,
  pageSize?: number,
  sortBy?: string,
  sortDirection?: SortDirection,
  searchNameTerm?: string
}


export const createDefaultValues = (query: IQueryType) => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
    sortBy: query.sortBy ? query.sortBy : "createdAt",
    sortDirection: query.sortDirection ? query.sortDirection as SortDirection : "desc",
    searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
  }
}

export const createDefaultValuesQueryParams = (query: IMainQueryType) => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
    sortBy: query.sortBy ? query.sortBy : "createdAt",
    sortDirection: query.sortDirection ? query.sortDirection as SortDirection : "desc",
  }
}
