import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function PrivateDeleteBlogApiResponse() {

  return applyDecorators(
    ApiResponse({
      status: 204,
      description: 'No Content',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({ status: 404, description: 'Not found' }),
  );

}