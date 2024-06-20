export const HTTP_STATUSES = {
  Success: 200,
  NotFound: 404,
  Forbidden: 403,
  Unauthorized: 401,
  BadRequest: 400,
  NotContent: 204,
  Created: 201,
  InternalServerError: 500,
  TooManyRequests: 429
}

export enum ResultCode {
  Success = 'Success',
  NotFound = 'NotFound',
  Forbidden = 'Forbidden',
  Unauthorized = 'Unauthorized',
  BadRequest = 'BadRequest',
  NotContent = 'NotContent',
  Created = 'Created',
  InternalServerError = 'InternalServerError',
}