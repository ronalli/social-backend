import { ObjectId, SortDirection } from 'mongodb';

export interface IUserQueryType {
  pageNumber?: number,
  pageSize?: number,
  sortBy?: string,
  sortDirection?: SortDirection,
  searchLoginTerm?: string,
  searchEmailTerm?: string
}

export interface IUserViewModel {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}


export interface IUserDBType  {
  _id?: ObjectId;
  login: string;
  email: string;
  hash: string;
  createdAt: string;
  emailConfirmation?: {
    confirmationCode: string | null,
    expirationDate: Date | null;
    isConfirmed?: boolean;
  };
}

export interface IUserQueryType {
  pageNumber?: number,
  pageSize?: number,
  sortBy?: string,
  sortDirection?: SortDirection,
  searchLoginTerm?: string,
  searchEmailTerm?: string
}

export interface IUserCreateModel {
  login: string;
  password: string;
  email: string;
}

export interface IUserInputModel {
  login: string;
  password: string;
  email: string;
}